# app/core/config.py

from functools import lru_cache
# config.py - Configuration file using Pydantic BaseSettings
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # Cấu hình ứng dụng
    VERSION: str = "0.1.0"

    # Cấu hình bảo mật & Server
    PORT: int = 8800
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Cấu hình cơ sở dữ liệu
    # Sử dụng Field(...) để đánh dấu là bắt buộc nếu không có giá trị mặc định
    # Hoặc cung cấp giá trị mặc định như bên dưới
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/rumai_db"

    # Cấu hình Redis (nếu sử dụng)
    REDIS_URL: str = "redis://localhost:6379"

    # Thêm các cấu hình khác nếu cần
    # HOST: str = "0.0.0.0"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8' # Thêm encoding để hỗ trợ ký tự đặc biệt nếu cần
        extra = 'ignore'  # Bỏ qua các biến môi trường không được định nghĩa trong Settings


@lru_cache()
def get_settings():
    """Lấy đối tượng settings và lưu vào bộ nhớ cache để tránh khởi tạo lại nhiều lần"""
    return Settings()