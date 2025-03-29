import os
from dotenv import load_dotenv

load_dotenv()



class Config:
    PORT = int(os.getenv("PORT", 8811))
    HOST = os.getenv("HOST", "0.0.0.0")
    PROJECT_NAME: str = "OCR Service"
    API_V1_STR: str = "/v2"
    DEFAULT_OCR_ENGINE = os.getenv("DEFAULT_OCR_ENGINE", "easyocr")
    QWEN_MODEL_PATH = os.getenv("QWEN_MODEL_PATH", "prithivMLmods/Qwen2-VL-OCR-2B-Instruct")
    EASYOCR_LANGUAGES = os.getenv("EASYOCR_LANGUAGES", "ru").split(",")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:xxxx")

config = Config()

