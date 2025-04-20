from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Gemini Settings (Defaults can be set here or left empty as requested)
    DEFAULT_GEMINI_MODEL_NAME: str = "" # e.g., "gemini-1.5-flash-latest"
    DEFAULT_GOOGLE_API_KEY: str = ""   # Will be loaded from .env or environment

    # Service settings
    PROJECT_NAME: str = "Gemini Proxy Service"
    API_V1_STR: str = ""  # Removed "/gemini" prefix to simplify path structure

    class Config:
        # Load environment variables from a .env file if it exists
        env_file = ".env"
        env_file_encoding = 'utf-8'

@lru_cache()
def get_settings() -> Settings:
    """
    Returns the settings instance, cached for performance.
    """
    return Settings()

settings = get_settings()