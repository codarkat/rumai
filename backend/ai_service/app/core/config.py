from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Gemini AI Service"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Simple API service for Google Gemini models"

    # API settings
    # API_V1_STR: str = "/api/v1"
    API_V1_STR: str = "/v1"

    # Gemini Settings
    GOOGLE_AI_STUDIO_API_KEY: str = ""
    GEMINI_VISION_MODEL_NAME: str = "gemini-2.0-flash"
    GEMINI_CHAT_MODEL_NAME: str = "gemini-2.5-pro-exp-03-25"

# Security settings - MUST match Auth Service
    SECRET_KEY: str = "your-secret-key-here"  # Load from environment variable
    ALGORITHM: str = "HS256"              # Load from environment variable
    AUTH_SERVICE_URL: str = "http://auth_service:8800" # Load from environment variable
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8' # Thêm encoding để hỗ trợ ký tự đặc biệt nếu cần
        extra = 'ignore'  # Bỏ qua các biến môi trường không được định nghĩa trong Settings


@lru_cache()
def get_settings():
    return Settings()