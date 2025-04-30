from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Gemini AI Service"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Simple API service for Google Gemini models"

    # API settings
    API_V1_STR: str = "/api/v1"

    # Gemini Settings
    GOOGLE_AI_STUDIO_API_KEY: str = os.getenv("GOOGLE_AI_STUDIO_API_KEY", "")
    GEMINI_VISION_MODEL_NAME: str = os.getenv("GEMINI_VISION_MODEL_NAME", "gemini-2.0-flash")
    GEMINI_CHAT_MODEL_NAME: str = os.getenv("GEMINI_CHAT_MODEL_NAME", "gemini-2.5-pro-exp-03-25")

    # JWT Settings (for internal JWT verification from Gateway)
    # This key MUST match the key used by auth_service to SIGN the internal JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "a_very_secure_secret_key_for_internal_jwt") # Choose a strong, unique key
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()