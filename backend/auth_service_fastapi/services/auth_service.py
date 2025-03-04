from sqlalchemy.exc import IntegrityError
import logging
from database import SessionLocal
from models.user import User
from utils.security import hash_password, verify_password, create_access_token


def register_user(user_data):
    db = SessionLocal()
    try:
        # Kiểm tra email đã tồn tại
        existing_user = db.query(User).filter(
            (User.email == user_data.email) |
            (User.username == user_data.username)
        ).first()
        if existing_user:
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
        return db_user
    except IntegrityError as e:
        logging.error(f"Database integrity error: {str(e)}")
        db.rollback()
        return None
    except Exception as e:
        logging.error(f"Error during user registration: {str(e)}")
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
            return None

        # Tạo token nếu xác thực thành công
        access_token = create_access_token(
            data={
                "sub": user.email,
                "user_id": user.id,
                "username": user.username
            }
        )
        return access_token

    except Exception as e:
        logging.error(f"Error during authentication: {str(e)}")
        return None
    finally:
        db.close()
