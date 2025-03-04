# auth.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.auth_service import register_user, authenticate_user

router = APIRouter()


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

class RegisterResponse(BaseModel):
    message: str
    user: UserResponse


class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/register",
             summary="Đăng ký người dùng",
             response_model=RegisterResponse,
             # response_description="Thông tin người dùng đã đăng ký thành công",
             status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    """
    Đăng ký người dùng mới với các thông tin:
    - **username**: tên người dùng
    - **email**: địa chỉ email
    - **password**: mật khẩu
    """
    created_user = register_user(user)
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đăng ký không thành công. Email hoặc username đã tồn tại."
        )
    return RegisterResponse(
        message="Đăng ký thành công",
        user=created_user
    )


@router.post("/login",
             summary="Đăng nhập người dùng",
             response_description="Token truy cập")
async def login(user: UserLogin):
    """
    Đăng nhập và lấy token với:
    - **email**: địa chỉ email đã đăng ký
    - **password**: mật khẩu
    """
    token = authenticate_user(user)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác"
        )
    return {"access_token": token, "token_type": "bearer"}
