# app/services/auth_service.py
import logging
from sqlalchemy.exc import IntegrityError
# Cập nhật đường dẫn import
from app.core.database import SessionLocal
from app.models.user import User
from app.utils.cache import cache_response, invalidate_cache # Tạm thời giữ ở utils, sẽ di chuyển sau
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token # Tạm thời giữ ở utils, sẽ di chuyển sau
from datetime import datetime, timezone
from sqlalchemy.orm import Session # Import Session

# Thêm cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Sửa hàm để nhận db session làm tham số thay vì tạo mới
def register_user(db: Session, user_data):
    """
    Đăng ký người dùng mới.

    Args:
        db: Session SQLAlchemy.
        user_data: Dữ liệu người dùng từ request (Pydantic model).

    Returns:
        Dict thông tin người dùng đã tạo hoặc None nếu thất bại.
    """
    try:
        # Kiểm tra email hoặc username đã tồn tại
        # Dùng ORM filter thay vì OR bitwise để rõ ràng hơn
        existing_user = db.query(User).filter(
            (User.email == user_data.email) |
            (User.username == user_data.username if user_data.username else False) # Chỉ kiểm tra username nếu có
        ).first()

        if existing_user:
            detail = "Email already registered."
            if user_data.username and existing_user.username == user_data.username:
                 detail = "Username already taken."
            logger.warning(f"Attempt to register with existing data: {user_data.email} / {user_data.username}")
            # Raise HTTPException ở đây để router xử lý thay vì trả về None
            # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
            # Hoặc trả về None để router xử lý
            return None # Giữ nguyên logic cũ để router xử lý

        # Tạo user mới
        hashed_password = hash_password(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            full_name=user_data.full_name,
            gemini_api_key=user_data.gemini_api_key, # Thêm gemini_api_key nếu có
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Không cần trả về dict nữa, router sẽ dùng UserResponse schema
        logger.info(f"Successfully registered new user: {user_data.email}")
        return db_user # Trả về đối tượng User ORM
    except IntegrityError as e:
        logger.error(f"Database integrity error during registration: {str(e)}")
        db.rollback()
        return None
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        db.rollback()
        return None
    # Không cần finally db.close() vì session được quản lý bởi Depends(get_db)


# Sửa hàm để nhận db session, email, password làm tham số
def authenticate_user(db: Session, email: str, password: str):
    """
    Xác thực người dùng.

    Args:
        db: Session SQLAlchemy.
        email: Email người dùng.
        password: Mật khẩu người dùng.

    Returns:
        Dict chứa access_token và refresh_token hoặc None nếu thất bại.
    """
    try:
        # Tìm user theo email
        user = db.query(User).filter(User.email == email).first()

        # Nếu không tìm thấy user, user bị inactive, hoặc mật khẩu không đúng
        if not user or not user.is_active or not verify_password(password, user.hashed_password):
            logger.warning(f"Failed login attempt for email: {email}")
            return None

        token_data = {
            "sub": user.email,
            "user_id": str(user.id),
            "username": user.username
        }
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        # Cập nhật thời gian đăng nhập gần nhất
        user.last_login = datetime.now(timezone.utc)
        db.commit() # Commit thay đổi last_login

        logger.info(f"Successful login for user: {email}")

        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

    except Exception as e:
        logger.error(f"Error during authentication for {email}: {str(e)}")
        return None
    # Không cần finally db.close()


@cache_response(expire_time_seconds=300)
async def get_user_by_email(email: str, db: Session): # Inject db session
    """Lấy user theo email (cached)."""
    try:
        user = db.query(User).filter(User.email == email).first()
        return user
    except Exception as e:
         logger.error(f"Error fetching user by email {email}: {e}")
         return None
    # Session được quản lý bởi dependency


@cache_response(expire_time_seconds=300)
async def get_user_by_id(user_id: str, db: Session): # Inject db session
    """Lấy user theo ID (cached)."""
    try:
        # Chuyển đổi user_id sang UUID nếu cần
        from uuid import UUID
        try:
            user_uuid = UUID(user_id)
        except ValueError:
            logger.warning(f"Invalid UUID format for user_id: {user_id}")
            return None
        user = db.query(User).filter(User.id == user_uuid).first()
        return user
    except Exception as e:
        logger.error(f"Error fetching user by ID {user_id}: {e}")
        return None
    # Session được quản lý bởi dependency