# main.py

from contextlib import asynccontextmanager # Import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware

# Cập nhật đường dẫn import
from app.api.routes import auth
from app.core.database import engine, Base, SessionLocal
from app.core.config import get_settings
from sqlalchemy.sql import text

from app.models.schemas import ServiceHealth, HealthCheck, ServicesStatus # Cập nhật đường dẫn import
from app.utils.cache import cache_response, redis_client # Cập nhật đường dẫn import


settings = get_settings() # Lấy settings instance
VERSION = settings.VERSION
PORT = settings.PORT # Lấy PORT từ settings

# Định nghĩa lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Logic chạy trước khi ứng dụng bắt đầu nhận request (startup)
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully (if they didn't exist).")
    except Exception as e:
        print(f"Error creating database tables during startup: {e}")
    yield
    # Logic chạy sau khi ứng dụng kết thúc (shutdown)
    # Ví dụ: đóng kết nối redis nếu cần
    if redis_client:
        try:
            await redis_client.close()
            print("Redis connection closed.")
        except Exception as e:
            print(f"Error closing Redis connection: {e}")

app = FastAPI(
    title="RumAI Auth Service API", # Cập nhật title
    description="API Documentation for RumAI Authentication Service", # Cập nhật description
    lifespan=lifespan, # Gắn lifespan vào app
    version=VERSION, # Sử dụng version từ settings
    # root_path="/auth", # Cân nhắc bỏ nếu dùng prefix trong include_router
    # servers=[ # Cấu hình server nếu cần
    #     {"url": "/auth", "description": "API Gateway"},
    #     {"url": f"http://localhost:{PORT}", "description": "Direct Access"}
    # ]
)

# Cấu hình CORS (ví dụ, nên điều chỉnh cho production)
# origins = [
#     "https://your-frontend-domain.com",
#     "http://localhost:3000", # Development frontend
# ]

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả trong dev, hạn chế trong production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"] # Có thể hạn chế header được expose nếu cần
)


@app.get("/")
async def root():
    # Redirect tới trang docs
    return RedirectResponse(url='/docs')

async def check_database() -> ServiceHealth:
    """Kiểm tra kết nối database"""
    db = None # Khởi tạo db là None
    try:
        db = SessionLocal()
        # Sử dụng text() để SQLAlchemy hiểu đây là câu SQL thuần
        db.execute(text('SELECT 1'))
        return ServiceHealth(
            status="healthy",
            details="connected"
        )
    except Exception as e:
        return ServiceHealth(
            status="unhealthy",
            details=str(e)
        )
    finally:
        if db: # Chỉ đóng nếu session được tạo thành công
            db.close()


async def check_redis() -> ServiceHealth:
    """Kiểm tra kết nối Redis"""
    if not redis_client: # Kiểm tra nếu redis_client không khởi tạo được
         return ServiceHealth(status="unhealthy", details="Redis client not initialized")
    try:
        await redis_client.ping()
        return ServiceHealth(
            status="healthy",
            details="connected"
        )
    except Exception as e:
        return ServiceHealth(
            status="unhealthy",
            details=str(e)
        )


@app.get(
    "/health",
    tags=["Health Check"],
    response_model=HealthCheck,
    summary="Check Service Health", # Thêm summary
    description="Kiểm tra trạng thái hoạt động của các services phụ thuộc (Database, Redis)."
)
@cache_response(expire_time_seconds=60) # Cache kết quả health check
async def health_check() -> HealthCheck:
    # Kiểm tra các services
    db_health = await check_database()
    redis_health = await check_redis()

    # Tổng hợp trạng thái
    services = ServicesStatus(
        database=db_health,
        redis=redis_health
    )

    # Xác định trạng thái tổng thể
    overall_status: Literal["healthy", "unhealthy"] = "healthy"
    if db_health.status == "unhealthy" or redis_health.status == "unhealthy":
        overall_status = "unhealthy"

    return HealthCheck(
        status=overall_status,
        services=services,
        version=VERSION
    )

# Đăng ký các router
# Thêm prefix /auth cho tất cả các route trong auth router
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


if __name__ == "__main__":
    import uvicorn
    # Sử dụng PORT từ settings
    uvicorn.run(app, host="0.0.0.0", port=PORT)
