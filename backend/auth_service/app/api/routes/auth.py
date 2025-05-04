# app/api/routes/auth.py
from datetime import timedelta, datetime, timezone
from fastapi import APIRouter, HTTPException, status, Request, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import Optional
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError

# Cập nhật đường dẫn import
from app.services.auth_service import register_user, authenticate_user
from app.utils.security import ( # Tạm thời giữ ở utils, sẽ di chuyển sau
    create_access_token,
    SECRET_KEY, ALGORITHM,
    hash_password, verify_password
)
from app.utils.cache import cache_response, invalidate_cache # Tạm thời giữ ở utils, sẽ di chuyển sau
from app.core.database import SessionLocal, get_db, Base # Thêm Base nếu cần tạo bảng trực tiếp từ đây
from app.models.user import User
from app.models.schemas import HealthCheck # Import các schema cần thiết (nếu có) từ app.models.schemas
from sqlalchemy.orm import Session
from uuid import UUID

import logging

logger = logging.getLogger(__name__)


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # Điều chỉnh tokenUrl nếu đường dẫn API thay đổi

# Global in‑memory storage for token blacklisting (logout and token revocation)
blacklisted_tokens = set()


# Dependency to get the current authenticated user
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Dependency to retrieve the current authenticated user.

    Raises:
        HTTPException: If the token is blacklisted, invalid, or user is not found.
    """
    if token in blacklisted_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked"
        )
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
    # Sử dụng Session từ database.py đã cập nhật
    db: Session = SessionLocal()
    try: # Thêm try...finally để đảm bảo session được đóng
        user = db.query(User).filter(User.email == email).first()
    finally:
        db.close()

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


class UserResponse(BaseModel):
    id: UUID
    username: Optional[str] = None
    email: str
    full_name: Optional[str] = None
    is_active: bool
    age: Optional[int] = None
    gender: Optional[str] = None
    russian_level: Optional[str] = None
    gemini_api_key: Optional[str] = None
    class Config:
        from_attributes = True


class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    russian_level: Optional[str] = None
    gemini_api_key: Optional[str] = None


class UpdateEmailRequest(BaseModel):
    email: str


class RegisterResponse(BaseModel):
    message: str
    user: UserResponse


class UserRegister(BaseModel):
    username: Optional[str] = None
    email: str
    password: str
    full_name: str
    gemini_api_key: Optional[str] = None


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


# --- Standard User Endpoints ---

@router.post("/register",
             summary="User registration",
             response_model=RegisterResponse,
             status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister, db: Session = Depends(get_db)): # Inject db session
    """
    Register a new user with the following information:
    - username: the user's username (optional)
    - email: the user's email address
    - password: the user's password
    - full_name: the user's full name
    - gemini_api_key: the user's Gemini API key (optional)

    Returns:
        JSON response containing a success message and user details.

    Raises:
        HTTPException: If registration fails due to existing email or username.
    """
    # Truyền db session vào hàm register_user
    created_user = register_user(db, user)
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. Email or username already exists."
        )
    return RegisterResponse(
        message="Registration successful",
        user=UserResponse.model_validate(created_user) # Sử dụng model_validate cho Pydantic v2
    )


@router.post("/login",
             summary="User login",
             response_model=TokenResponse)
async def login(user: UserLogin, request: Request, db: Session = Depends(get_db)): # Inject db session
    """
    Authenticate a user and return access and refresh tokens.

    Parameters:
        user: User login data including email and password.
        request: The incoming request.
        db: Database session dependency.

    Returns:
        JSON response containing access token, refresh token, and token type.

    Raises:
        HTTPException: If the email or password is incorrect.
    """
    # Truyền db session vào hàm authenticate_user
    tokens = authenticate_user(db, user.email, user.password)
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    return tokens


@router.post("/refresh-token",
             summary="Refresh access token",
             response_model=TokenResponse)
async def refresh_token(data: RefreshTokenRequest):
    """
    Generate a new access token using a valid refresh token.

    Parameters:
        data: Refresh token payload.

    Returns:
        JSON response containing the new access token along with the refresh token.

    Raises:
        HTTPException: If the refresh token is invalid or expired.
    """
    try:
        payload = jwt.decode(data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        # Kiểm tra các claim cần thiết trong refresh token
        email = payload.get("sub")
        user_id = payload.get("user_id")
        if not email or not user_id:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token payload"
            )

        token_data = {
            "sub": email,
            "user_id": user_id,
             # "username": payload.get("username") # Lấy username nếu có
        }
        new_access_token = create_access_token(token_data)
        return {
            "access_token": new_access_token,
            "refresh_token": data.refresh_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid or expired"
        )


@router.post("/logout", summary="Logout user", status_code=status.HTTP_200_OK)
async def logout(token: str = Depends(oauth2_scheme)):
    """
    Logout the user by blacklisting the current authentication token.

    Parameters:
        token: The token extracted from the request.

    Returns:
        JSON message confirming successful logout.
    """
    blacklisted_tokens.add(token)
    return {"message": "Successfully logged out"}


@router.post("/revoke-token", summary="Revoke token", status_code=status.HTTP_200_OK)
async def revoke_token(token: str = Depends(oauth2_scheme)):
    """
    Revoke the provided token explicitly by blacklisting it.

    Parameters:
        token: The token to revoke.

    Returns:
        JSON message indicating the token has been revoked.
    """
    blacklisted_tokens.add(token)
    return {"message": "Token has been revoked"}


@router.post("/verify-email/initiate", summary="Initiate email verification", status_code=status.HTTP_200_OK)
async def initiate_email_verification(current_user: User = Depends(get_current_user)):
    """
    Generate a verification token for email confirmation and simulate sending it.
    In production, this token should be emailed to the user.

    Parameters:
        current_user: The currently authenticated user.

    Returns:
        JSON message with the verification token.
    """
    token = create_access_token(
        {"sub": current_user.email, "scope": "email_verification"}, # Thêm scope để phân biệt
        expires_delta=timedelta(minutes=30)
    )
    # TODO: Send email with the token in production
    logger.info(f"Generated email verification token for {current_user.email}: {token}")
    return {"message": "Verification email sent (simulated)", "verification_token": token}


@router.get("/verify-email",
            summary="Verify user email",
            status_code=status.HTTP_200_OK)
async def verify_email(token: str, db: Session = Depends(get_db)): # Inject db session
    """
    Verify the user's email using the provided token.

    Parameters:
        token: The email verification token.
        db: Database session dependency.

    Returns:
        JSON message indicating successful email verification.

    Raises:
        HTTPException: If the token payload is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid verification token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        scope = payload.get("scope")
        if email is None or scope != "email_verification":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.email_verified:
         return {"message": "Email already verified"}

    user.email_verified = True
    try:
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during email verification: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to verify email")

    return {"message": "Email successfully verified"}


@router.post("/forgot-password", summary="Initiate password reset flow", status_code=status.HTTP_200_OK)
async def forgot_password(request_data: ForgotPasswordRequest, db: Session = Depends(get_db)): # Inject db session
    """
    Accept an email address and, if a user exists, create a short-lived reset token.
    In production, this token should be emailed to the user.

    Parameters:
        request_data: Contains the user's email.
        db: Database session dependency.

    Returns:
        JSON message confirming that if the email exists, a reset link has been sent.
    """
    user = db.query(User).filter(User.email == request_data.email).first()
    # Always return the same response to avoid email harvesting
    reset_token = None
    if user:
        reset_token = create_access_token(
            {"sub": user.email, "scope": "password_reset"}, # Thêm scope
            expires_delta=timedelta(minutes=15)
        )
        # TODO: Send email with the token in production
        logger.info(f"Generated password reset token for {user.email}: {reset_token}")

    return {"message": "If your email exists in the system, a password reset link was sent (simulated).",
            "reset_token": reset_token} # Trả về token để test


@router.post("/reset-password", summary="Reset password using token", status_code=status.HTTP_200_OK)
async def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)): # Inject db session
    """
    Reset the user's password after verifying the provided reset token.

    Parameters:
        data: Contains the reset token and the new password.
        db: Database session dependency.

    Returns:
        JSON confirmation message that the password has been reset.

    Raises:
        HTTPException: If the token is invalid, expired, or if the user is not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired password reset token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        scope: str = payload.get("scope")
        if email is None or scope != "password_reset":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.hashed_password = hash_password(data.new_password)
    try:
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during password reset: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to reset password")

    return {"message": "Password has been reset successfully"}


@router.post("/change-password", summary="Change password for authenticated user", status_code=status.HTTP_200_OK)
async def change_password(
        data: ChangePasswordRequest,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db) # Inject db session
):
    """
    Change the password for the authenticated user after verifying the old password.

    Parameters:
        data: Contains the old and new passwords.
        current_user: The currently authenticated user.
        db: Database session dependency.

    Returns:
        JSON confirmation message that the password has been changed.

    Raises:
        HTTPException: If the old password is incorrect.
    """
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password is incorrect")

    # Lấy user từ DB bằng ID để đảm bảo instance được quản lý bởi session hiện tại
    user = db.query(User).filter(User.id == current_user.id).first()
    # Mặc dù get_current_user đã kiểm tra, kiểm tra lại ở đây là an toàn
    if not user:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.hashed_password = hash_password(data.new_password)
    try:
        db.commit()
        # Invalidate cache liên quan nếu có
        await invalidate_cache(f"get_profile:{user.id}") # Ví dụ cache key
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during password change: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to change password")

    return {"message": "Password has been changed successfully"}


@router.get("/profile", summary="Retrieve current user profile", response_model=UserResponse)
@cache_response(expire_time_seconds=300) # Cache profile response
async def get_profile(current_user: User = Depends(get_current_user)):
    """
    Retrieve the profile of the currently authenticated user.

    Parameters:
        current_user: The currently authenticated user.

    Returns:
        JSON response containing user profile details.
    """
    # Trả về dữ liệu theo UserResponse schema
    # Pydantic v2 sử dụng model_validate hoặc from_orm (nếu Config.from_attributes = True)
    return UserResponse.model_validate(current_user)


@router.put("/profile", summary="Update user profile", response_model=UserResponse)
async def update_profile(
        request: UpdateUserRequest,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """
    Update the profile of the currently authenticated user.

    Parameters:
        request: Data containing fields to update.
        current_user: The currently authenticated user.
        db: Database session dependency.

    Returns:
        The updated user profile.

    Raises:
        HTTPException: If the user is not found or username is taken.
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = request.model_dump(exclude_unset=True) # Pydantic v2: model_dump()

    # Kiểm tra nếu username được cập nhật và khác với username hiện tại
    if "username" in update_data and update_data["username"] != user.username:
        # Kiểm tra username mới đã tồn tại chưa (ngoại trừ user hiện tại)
        existing_user = db.query(User).filter(
            User.username == update_data["username"],
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    # Cập nhật thông tin user
    for key, value in update_data.items():
        setattr(user, key, value)

    try:
        db.commit()
        # Invalidate cache cho profile đã cập nhật
        await invalidate_cache(f"get_profile:{user.id}") # Sử dụng cache key phù hợp
        db.refresh(user)
        return UserResponse.model_validate(user) # Trả về theo schema
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating profile: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update profile")
    except Exception as e: # Bắt các lỗi khác nếu có
        logger.error(f"Unexpected error updating profile: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")


@router.put("/profile/email", summary="Update user email and reset verification", response_model=UserResponse)
async def update_email(
        update_data: UpdateEmailRequest,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """
    Update the user's email and reset email verification status. Requires re-verification.

    Parameters:
        update_data: Contains the new email.
        current_user: The currently authenticated user.
        db: Database session dependency.

    Returns:
        The updated user profile.

    Raises:
        HTTPException: If the user is not found or email is already taken.
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_email = update_data.email
    if user.email == new_email:
        return UserResponse.model_validate(user) # Không có gì thay đổi

    # Kiểm tra email mới đã tồn tại chưa
    existing_email = db.query(User).filter(User.email == new_email).first()
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user.email = new_email
    user.email_verified = False # Yêu cầu xác thực lại email mới
    try:
        db.commit()
         # Invalidate cache liên quan
        await invalidate_cache(f"get_profile:{user.id}")
        await invalidate_cache(f"get_user_by_email:{user.email}") # Cache key cũ
        db.refresh(user)
        # TODO: Có thể gửi lại email xác thực ở đây
        logger.info(f"User {user.id} updated email to {new_email}. Verification reset.")
        return UserResponse.model_validate(user)
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating email: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update email")


@router.delete("/profile", summary="Deactivate user account", status_code=status.HTTP_200_OK)
async def deactivate_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Deactivate the account of the currently authenticated user.
    Instead of a hard delete, the user account is set as inactive.

    Parameters:
        current_user: The currently authenticated user.
        db: Database session dependency.

    Returns:
        JSON message confirming account deactivation.

    Raises:
        HTTPException: If the user is not found.
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not user.is_active:
         return {"message": "User account is already inactive"}

    user.is_active = False
    try:
        db.commit()
        # Invalidate cache liên quan
        await invalidate_cache(f"get_profile:{user.id}")
        # Có thể cân nhắc blacklist token hiện tại của user
        # blacklisted_tokens.add(token_used_for_this_request)
        logger.info(f"User account {user.id} deactivated.")
        return {"message": "User account has been deactivated"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deactivating account: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to deactivate account")


@router.delete("/profile/permanent", summary="Permanently delete user account", status_code=status.HTTP_200_OK)
async def delete_account_permanent(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Permanently delete the account of the currently authenticated user.
    This action removes the user from the database entirely. Use with caution.

    Parameters:
        current_user: The currently authenticated user.
        db: Database session dependency.

    Returns:
        JSON message confirming permanent deletion.

    Raises:
        HTTPException: If the user is not found.
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    try:
        # Xóa cache trước khi xóa user
        await invalidate_cache(f"get_profile:{user.id}")
        await invalidate_cache(f"get_user_by_id:{user.id}")
        await invalidate_cache(f"get_user_by_email:{user.email}")

        db.delete(user)
        db.commit()
        # Có thể cân nhắc blacklist token hiện tại của user
        logger.info(f"User account {user.id} permanently deleted.")
        return {"message": "User account has been permanently deleted"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error permanently deleting account: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete account permanently")


@router.post("/validate-token",
             summary="Validate JWT token",
             response_model=dict, # Trả về dict đơn giản
             status_code=status.HTTP_200_OK)
async def validate_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Validate the integrity and expiration of a JWT token and check if the user exists.

    Parameters:
        token: JWT token passed via Authorization header.
        db: Database session dependency.

    Returns:
        JSON response with user info if the token is valid.

    Raises:
        HTTPException: If the token is invalid, expired, revoked, or user not found.
    """
    # Kiểm tra token có trong blacklist không
    if token in blacklisted_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
             headers={"WWW-Authenticate": "Bearer"},
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token or token has expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Giải mã và xác thực token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False}) # Bỏ qua audience nếu không dùng
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id") # Lấy user_id nếu có

        if email is None: # Chỉ cần email là đủ để tìm user
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # Kiểm tra user có tồn tại trong database không
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with token not found"
        )

    # Kiểm tra user có bị inactive không
    if not user.is_active:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive"
        )

    # Trả về thông tin cơ bản của user để xác nhận token hợp lệ
    return {
        "valid": True,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "username": user.username
        }
    }