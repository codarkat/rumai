import logging
from sqlalchemy.exc import IntegrityError
from database import SessionLocal
from models.user import User
from utils.security import hash_password, verify_password, create_access_token

# Thêm cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def register_user(user_data):
    db = SessionLocal()
    try:
        # Kiểm tra email đã tồn tại
        existing_user = db.query(User).filter(
            (User.email == user_data.email) |
            (User.username == user_data.username)
        ).first()
        if existing_user:
            logger.warning(f"Attempt to register with existing email/username: {user_data.email}")
            return None

        # Tạo user mới
        hashed_password = hash_password(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        user_response = {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "is_active": db_user.is_active
        }
        logger.info(f"Successfully registered new user: {user_data.email}")
        return user_response
    except IntegrityError as e:
        logger.error(f"Database integrity error: {str(e)}")
        db.rollback()
        return None
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        db.rollback()
        return None
    finally:
        db.close()


def authenticate_user(user_data):
    db = SessionLocal()
    try:
        # Tìm user theo email
        user = db.query(User).filter(User.email == user_data.email).first()

        # Nếu không tìm thấy user hoặc mật khẩu không đúng
        if not user or not verify_password(user_data.password, user.hashed_password):
            logger.warning(f"Failed login attempt for email: {user_data.email}")
            return None

        # Tạo token nếu xác thực thành công
        access_token = create_access_token(
            data={
                "sub": user.email,
                "user_id": user.id,
                "username": user.username
            }
        )
        logger.info(f"Successful login for user: {user_data.email}")
        return access_token

    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        return None
    finally:
        db.close()
