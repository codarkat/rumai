# auth.py
from datetime import timedelta, datetime, timezone
from fastapi import APIRouter, HTTPException, status, Request, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from services.auth_service import register_user, authenticate_user
from utils.security import create_access_token, SECRET_KEY, ALGORITHM, hash_password, verify_password
from database import SessionLocal
from models.user import User
from sqlalchemy.orm import Session

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # change tokenUrl accordingly

# Dependency to get the current authenticated user
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    db: Session = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


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


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str



@router.post("/register",
             summary="Đăng ký người dùng",
             response_model=RegisterResponse,
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
             response_model=TokenResponse)
async def login(user: UserLogin, request: Request):
    """
    Đăng nhập và lấy token với:
    - **email**: địa chỉ email đã đăng ký
    - **password**: mật khẩu
    """
    tokens = authenticate_user(user)
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác"
        )
    return tokens


@router.post("/refresh-token",
             summary="Lấy access token mới từ refresh token",
             response_model=TokenResponse)
async def refresh_token(data: RefreshTokenRequest):
    """
    Lấy access token mới từ refresh token
    - **refresh_token**: token đã được cấp trước đó
    """
    try:
        payload = jwt.decode(data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        # Kiểm tra lại các claims nếu cần (vd: kiểm tra sub, user_id,...)
        token_data = {
            "sub": payload.get("sub"),
            "user_id": payload.get("user_id"),
            "username": payload.get("username")
        }
        new_access_token = create_access_token(token_data)
        # Trong ví dụ này, có thể trả về luôn cả refresh token cũ.
        # Nếu cần, có thể tạo refresh token mới để tăng tính bảo mật.
        return {
            "access_token": new_access_token,
            "refresh_token": data.refresh_token,
            "token_type": "bearer"
        }
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token không hợp lệ hoặc đã hết hạn"
        )


@router.get("/verify-email", 
            summary="Xác minh email người dùng",
            status_code=status.HTTP_200_OK)
async def verify_email(token: str):
    """
    Xác minh email người dùng
    - **token**: token xác minh được gửi qua email
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token không hợp lệ")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token không hợp lệ")

    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        db.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng")

    user.email_verified = True
    db.add(user)
    db.commit()
    db.close()

    return {"message": "Email đã được xác minh thành công"}


@router.post("/forgot-password", summary="Initiate password reset flow", status_code=status.HTTP_200_OK)
async def forgot_password(request_data: ForgotPasswordRequest):
    """
    Accepts an email and, if a user exists, creates a short-lived reset token.
    In production this token should be emailed to the user.
    """
    db = SessionLocal()
    user = db.query(User).filter(User.email == request_data.email).first()
    db.close()
    # Always return the same response to avoid email harvesting
    if user:
        reset_token = create_access_token(
            {"sub": user.email},
            expires_delta=timedelta(minutes=15)
        )
        # Here you would send the reset_token by email.
        # For demonstration purposes, we include the token in the response.
        return {"message": "If your email exists in the system, a password reset link was sent.",
                "reset_token": reset_token}
    return {"message": "If your email exists in the system, a password reset link was sent."}


@router.post("/reset-password", summary="Reset password using token", status_code=status.HTTP_200_OK)
async def reset_password(data: ResetPasswordRequest):
    """
    Resets the user password after verifying the reset token.
    """
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        db.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.hashed_password = hash_password(data.new_password)
    db.add(user)
    db.commit()
    db.close()
    return {"message": "Password has been reset successfully"}


@router.post("/change-password", summary="Change password for authenticated users", status_code=status.HTTP_200_OK)
async def change_password(
        data: ChangePasswordRequest,
        current_user: User = Depends(get_current_user)
):
    """
    Changes the password for an authenticated user.
    Verifies the old password and updates with the new one.
    """
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password is incorrect")

    db = SessionLocal()
    user = db.query(User).filter(User.id == current_user.id).first()
    if user:
        user.hashed_password = hash_password(data.new_password)
        db.commit()
        db.close()
        return {"message": "Password has been changed successfully"}
    db.close()
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")