from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, ValidationError
import logging

# Sử dụng cấu hình mới từ file config đã sửa
from .config import get_settings

settings = get_settings()

# Scheme này mong đợi token trong header Authorization,
# được Gateway chuyển tiếp sau khi xác thực với auth_service.
# tokenUrl ở đây không thực sự quan trọng vì việc xác thực đã xảy ra trước khi đến service này.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class TokenData(BaseModel):
    # Định nghĩa cấu trúc payload mong đợi của JWT nội bộ
    # Điều chỉnh theo cấu trúc thực tế mà auth_service đưa vào token
    sub: str | None = None # Subject (ví dụ: user_id hoặc email)
    # Thêm các claim khác nếu cần, ví dụ: roles, permissions
    # roles: list[str] = []


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    """
    Xác minh JWT nội bộ được Gateway chuyển tiếp.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        # --- QUAN TRỌNG ---
        # Trích xuất thông tin cần thiết. Điều chỉnh tên trường ('sub', 'username', v.v.)
        # dựa trên cấu trúc payload thực tế của JWT do auth_service tạo ra.
        user_identifier: str | None = payload.get("sub") # Hoặc có thể là 'user_id', 'email', v.v.

        if user_identifier is None:
            logging.error("Missing 'sub' (or expected identifier) claim in JWT payload")
            raise credentials_exception

        # Có thể bạn muốn thêm validation ở đây tùy thuộc vào nhu cầu
        # Ví dụ: kiểm tra sự tồn tại của các claim cụ thể

        token_data = TokenData(sub=user_identifier) # Tạo đối tượng TokenData dựa trên payload

        return token_data
    except JWTError as e:
        logging.error(f"JWTError decoding token: {e}")
        raise credentials_exception
    except ValidationError as e:
        logging.error(f"Payload validation error: {e}")
        # Có thể trả về lỗi 422 Unprocessable Entity thay vì 401 tùy ngữ cảnh
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid token payload: {e}"
        )
    except Exception as e:
        logging.error(f"Unexpected error validating token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during token validation"
        )