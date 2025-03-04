# auth.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.services.auth_service import register_user, authenticate_user

router = APIRouter()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register", summary="Đăng ký người dùng")
async def register(user: UserRegister):
    created_user = register_user(user)
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Đăng ký không thành công"
        )
    return {"message": "Đăng ký thành công", "user": created_user}

@router.post("/login", summary="Đăng nhập người dùng")
async def login(user: UserLogin):
    token = authenticate_user(user)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Thông tin đăng nhập không hợp lệ"
        )
    return {"access_token": token, "token_type": "bearer"}
