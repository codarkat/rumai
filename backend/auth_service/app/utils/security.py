# app/utils/security.py
import logging
from datetime import datetime, timedelta, timezone

from jose import jwt

# Cập nhật đường dẫn import
from app.core.config import get_settings

# - Loại bỏ warning về bcrypt version
logging.getLogger("passlib").setLevel(logging.ERROR)
from passlib.context import CryptContext


settings = get_settings() # Gọi hàm để lấy đối tượng settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS

# Constants for Internal JWT
INTERNAL_JWT_SECRET_KEY = settings.INTERNAL_JWT_SECRET_KEY
INTERNAL_JWT_ALGORITHM = settings.INTERNAL_JWT_ALGORITHM
INTERNAL_JWT_EXPIRE_MINUTES = settings.INTERNAL_JWT_EXPIRE_MINUTES

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_internal_jwt(data: dict):
    """
    Tạo JWT nội bộ để giao tiếp giữa Gateway và các microservices.
    Sử dụng secret key và thuật toán riêng biệt.
    """
    to_encode = data.copy()
    # Đặt thời gian hết hạn ngắn hơn cho token nội bộ
    expire = datetime.now(timezone.utc) + timedelta(minutes=INTERNAL_JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iss": "auth_service"}) # Thêm issuer để xác định nguồn gốc token
    return jwt.encode(to_encode, INTERNAL_JWT_SECRET_KEY, algorithm=INTERNAL_JWT_ALGORITHM)