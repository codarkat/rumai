# backend/ai_service/app/core/security.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import httpx
from httpx import RequestError, HTTPStatusError
import logging # Thêm logging

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__) # Khởi tạo logger

# Sử dụng cùng tokenUrl với auth_service nếu frontend lấy token từ đó
# Hoặc một URL giả nếu AI service không cấp token trực tiếp
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Tạo một client httpx để tái sử dụng kết nối (tốt cho hiệu năng)
# Timeout có thể cần điều chỉnh tùy thuộc vào mạng nội bộ của bạn
# Verify=False nếu dùng HTTP nội bộ và không có SSL/TLS hợp lệ (không khuyến khích cho production)
# Nên cấu hình SSL/TLS hợp lệ giữa các service
http_client = httpx.AsyncClient(base_url=settings.AUTH_SERVICE_URL, timeout=5.0, verify=False)


async def verify_token(token: str = Depends(oauth2_scheme)):
    """
    Xác thực token JWT bằng cách:
    1. Giải mã cơ bản với SECRET_KEY và ALGORITHM.
    2. Gọi đến endpoint /auth/validate-token của auth_service.

    Args:
        token: Token JWT từ header Authorization.

    Returns:
        Payload người dùng (ví dụ: email hoặc user ID) từ token nếu hợp lệ.

    Raises:
        HTTPException: Với status 401 nếu token không hợp lệ, hết hạn, bị thu hồi,
                       hoặc xác thực từ auth_service thất bại.
        HTTPException: Với status 503 nếu không thể kết nối đến auth_service.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    service_unavailable_exception = HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Authentication service is unavailable",
    )

    # --- Bước 1: Decode cơ bản để kiểm tra format và hạn sử dụng ---
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            # Có thể thêm options={"verify_aud": False} nếu audience không được sử dụng nhất quán
        )
        email: str = payload.get("sub")
        if email is None:
            # Thiếu 'sub' claim -> token không hợp lệ theo cấu trúc mong đợi
            logger.warning("Token validation failed: Missing 'sub' claim.")
            raise credentials_exception
    except JWTError as e:
        # Lỗi decode (sai signature, hết hạn, format sai, etc.)
        logger.warning(f"JWT decode error: {e}")
        raise credentials_exception

    # --- Bước 2: Gọi đến auth_service để xác thực toàn diện ---
    try:
        # Endpoint trong auth_service là /auth/validate-token
        # Nó cũng dùng Depends(oauth2_scheme) nên ta cần gửi token trong header
        headers = {"Authorization": f"Bearer {token}"}
        response = await http_client.post("/auth/validate-token", headers=headers)

        # Kiểm tra response từ auth_service
        response.raise_for_status() # Raise exception cho status code >= 400

        # Nếu auth_service trả về 200 OK, token hợp lệ
        validation_data = response.json()
        if validation_data.get("valid"):
             # Trả về email hoặc user_id từ payload gốc sau khi đã xác thực thành công
            user_info = validation_data.get("user", {})
            logger.info(f"Token validated successfully for user: {user_info.get('email')}")
            # Trả về dict chứa thông tin user từ auth_service để nhất quán
            return user_info
            # Hoặc trả về payload gốc nếu cần thông tin khác:
            # return payload
        else:
            # Trường hợp auth_service trả về 200 nhưng "valid": false (ít khả năng với endpoint hiện tại)
             logger.warning("Token validation failed: Auth service returned valid=false.")
             raise credentials_exception

    except RequestError as e:
        # Lỗi kết nối đến auth_service (network error, DNS lookup failed, etc.)
        logger.error(f"Connection error to auth service at {settings.AUTH_SERVICE_URL}: {e}")
        raise service_unavailable_exception
    except HTTPStatusError as e:
        # auth_service trả về lỗi >= 400 (ví dụ 401 Unauthorized, 404 Not Found)
        if e.response.status_code == status.HTTP_401_UNAUTHORIZED:
            # Token bị auth_service từ chối (revoked, user inactive, etc.)
            detail = "Token is invalid, revoked, or user is inactive"
            try: # Cố gắng lấy detail từ response của auth_service
                detail = e.response.json().get("detail", detail)
            except Exception:
                pass
            logger.warning(f"Token validation failed: Auth service returned 401. Detail: {detail}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=detail,
                headers={"WWW-Authenticate": "Bearer"},
            )
        elif e.response.status_code == status.HTTP_404_NOT_FOUND:
             # User không tồn tại theo auth_service
             logger.warning("Token validation failed: User not found by auth service.")
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, # Trả về 401 cho client cuối
                detail="User associated with token not found",
                 headers={"WWW-Authenticate": "Bearer"},
            )
        else:
            # Các lỗi khác từ auth_service (5xx)
            logger.error(f"Auth service returned error {e.response.status_code}: {e.response.text}")
            raise service_unavailable_exception
    except Exception as e:
        # Các lỗi không mong muốn khác
        logger.exception(f"Unexpected error during token validation: {e}") # Dùng exception để log cả traceback
        raise service_unavailable_exception

# Đảm bảo đóng client khi ứng dụng tắt (quan trọng)
async def close_http_client():
    await http_client.aclose()
    logger.info("HTTP client closed.")

# Cần đăng ký event handler trong main.py của ai_service:
# from app.core.security import close_http_client
#
# @app.on_event("startup")
# async def startup_event():
#     # Các khởi tạo khác nếu có
#     pass
#
# @app.on_event("shutdown")
# async def shutdown_event():
#     await close_http_client()