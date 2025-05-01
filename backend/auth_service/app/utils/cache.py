# app/utils/cache.py
import json

from fastapi.encoders import jsonable_encoder
from redis import asyncio as aioredis
from functools import wraps
from datetime import timedelta
# Cập nhật đường dẫn import
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)

# Cấu hình Redis
settings = get_settings() # Gọi hàm để lấy đối tượng settings
REDIS_URL = settings.REDIS_URL

# Khởi tạo Redis client
# Thêm xử lý lỗi nếu không kết nối được Redis
redis_client = None
try:
    redis_client = aioredis.from_url(REDIS_URL, encoding='utf-8', decode_responses=True)
    # Ping để kiểm tra kết nối sớm
    # await redis_client.ping() # Cần async context để ping, nên bỏ qua ở đây
    logger.info(f"Successfully connected to Redis at {REDIS_URL}")
except Exception as e:
    logger.error(f"Could not connect to Redis at {REDIS_URL}: {e}")
    # Có thể raise lỗi ở đây hoặc để các hàm sử dụng redis_client tự xử lý None


def cache_response(expire_time_seconds: int = 60):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not redis_client:
                 logger.warning("Redis client not available, skipping cache.")
                 return await func(*args, **kwargs)

            try:
                # Tạo cache key (cải thiện cách tạo key)
                # Nên loại bỏ các đối tượng không thể hash hoặc chuyển đổi thành string ổn định
                # Ví dụ: Bỏ qua các đối tượng Session SQLAlchemy nếu có trong args/kwargs
                key_parts = [func.__name__]
                for arg in args:
                    # Bỏ qua session hoặc các đối tượng phức tạp khác
                    if hasattr(arg, '__class__') and 'Session' in str(arg.__class__):
                        continue
                    try:
                        key_parts.append(str(arg))
                    except Exception: # Bỏ qua nếu không thể chuyển thành string
                        pass
                for k, v in kwargs.items():
                     if hasattr(v, '__class__') and 'Session' in str(v.__class__):
                        continue
                     try:
                        key_parts.append(f"{k}={v}")
                     except Exception:
                        pass

                cache_key = ":".join(key_parts)
                logger.info(f"Attempting to get from cache: {cache_key}")

                # Thử lấy từ cache
                cached = await redis_client.get(cache_key)
                if cached:
                    logger.debug(f"Cache hit for {func.__name__} - key: {cache_key}")
                    try:
                         return json.loads(cached)
                    except json.JSONDecodeError:
                         logger.warning(f"Failed to decode cached JSON for key {cache_key}. Fetching fresh data.")


                # Nếu không có trong cache, gọi hàm gốc
                logger.debug(f"Cache miss for {func.__name__} - key: {cache_key}")
                response = await func(*args, **kwargs)

                # Chuyển đổi response thành JSON trước khi cache
                try:
                    cache_data = jsonable_encoder(response)
                    json_cache_data = json.dumps(cache_data)
                except TypeError as e:
                     logger.error(f"Could not serialize response for caching ({func.__name__}): {e}")
                     return response # Trả về response gốc nếu không thể serialize

                # Lưu vào cache
                await redis_client.setex(
                    cache_key,
                    expire_time_seconds,
                    json_cache_data
                )

                logger.debug(f"Cached result for {func.__name__} - key: {cache_key}")

                return response

            except aioredis.RedisError as e:
                 logger.error(f"Redis error during cache operation ({func.__name__}): {str(e)}")
                 # Fallback to original function if cache fails
                 return await func(*args, **kwargs)
            except Exception as e:
                logger.error(f"Unexpected cache wrapper error ({func.__name__}): {str(e)}")
                # Fallback to original function for other unexpected errors
                return await func(*args, **kwargs)

        return wrapper

    return decorator


async def invalidate_cache(pattern: str):
    """Xóa cache theo pattern"""
    if not redis_client:
        logger.warning("Redis client not available, skipping cache invalidation.")
        return

    try:
        # Sử dụng scan_iter để hiệu quả hơn với lượng key lớn
        async for key in redis_client.scan_iter(match=pattern):
            await redis_client.delete(key)
            logger.info(f"Invalidated cache key: {key}")
        # Hoặc giữ nguyên keys() nếu số lượng key không quá lớn
        # keys = await redis_client.keys(pattern)
        # if keys:
        #     deleted_count = await redis_client.delete(*keys)
        #     logger.info(f"Invalidated {deleted_count} cache keys matching pattern: {pattern}")
    except aioredis.RedisError as e:
        logger.error(f"Redis error during cache invalidation (pattern: {pattern}): {e}")
    except Exception as e:
         logger.error(f"Unexpected error during cache invalidation (pattern: {pattern}): {e}")