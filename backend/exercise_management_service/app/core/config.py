import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Service settings
    PROJECT_NAME: str = "Exercise Management Service"
    API_V1_STR: str = "/api/v1"

    # Database Configuration
    # These will be loaded from the main .env file via compose.yaml
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "exercise-db") # Default to service name if not set
    POSTGRES_USER: str = os.getenv("EXERCISE_DB_USER", "exercise_user")
    POSTGRES_PASSWORD: str = os.getenv("EXERCISE_DB_PASSWORD", "exercise_password")
    POSTGRES_DB: str = os.getenv("EXERCISE_DB_NAME", "exercise_db")
    DATABASE_URL: Optional[str] = None # Constructed dynamically

    # Admin Credentials (Load from env vars for security)
    ADMIN_USERNAME: str = os.getenv("EXERCISE_ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("EXERCISE_ADMIN_PASSWORD", "changeme") # Default, should be overridden by env var

    # Gemini Service URL (To call the other service)
    GEMINI_SERVICE_URL: str = os.getenv("GEMINI_SERVICE_URL", "http://gemini-service:8001/api/v1") # Assuming Docker network

    # JWT Settings
    SECRET_KEY: str = os.getenv("EXERCISE_SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7") # Default, CHANGE THIS!
    ALGORITHM: str = os.getenv("EXERCISE_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("EXERCISE_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


    def __init__(self, **values):
        super().__init__(**values)
        # Construct DATABASE_URL after loading other variables
        # Ensure values are loaded before constructing the URL
        pg_user = self.POSTGRES_USER
        pg_password = self.POSTGRES_PASSWORD
        pg_server = self.POSTGRES_SERVER
        pg_db = self.POSTGRES_DB
        self.DATABASE_URL = f"postgresql+asyncpg://{pg_user}:{pg_password}@{pg_server}/{pg_db}"


    class Config:
        # Load environment variables from a .env file if it exists
        # Note: In Docker, env vars are usually passed directly, but this helps local dev
        env_file = ".env" # Looks for .env in the service directory first
        env_file_encoding = 'utf-8'
        # Allow extra fields not defined in the model (e.g., from main .env)
        extra = 'ignore'


@lru_cache()
def get_settings() -> Settings:
    """
    Returns the settings instance, cached for performance.
    """
    return Settings()

settings = get_settings()