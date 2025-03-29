import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class Config:
    PROJECT_NAME: str = "OCR Service"
    API_V1_STR: str = "/v1"
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:xxxx")

config = Config()