from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from services.auth_service import AuthService
from services.ocr_service import OCRService
from typing import List, Dict, Any

from config import config

# Import các exception từ google.api_core
from google.api_core.exceptions import GoogleAPIError, PermissionDenied, ResourceExhausted, InvalidArgument

router = APIRouter(prefix="/ocr", tags=["OCR Services"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        # Đầu tiên decode token để kiểm tra format
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        # Kiểm tra token với Auth Service
        auth_service = AuthService()
        is_valid = await auth_service.validate_token(token)
        if not is_valid:
            raise HTTPException(
                status_code=401,
                detail="Token has been revoked or is invalid"
            )

        return email
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token is invalid or expired"
        )


@router.post("/detect-text")
async def detect_text(
    file: UploadFile = File(...),
    token: str = Depends(verify_token)
):
    """
    API endpoint để nhận dạng văn bản từ hình ảnh được tải lên.
    Yêu cầu xác thực bằng Bearer token.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Đọc nội dung file
        contents = await file.read()

        # Khởi tạo OCR service
        ocr_service = OCRService()

        # Thực hiện nhận dạng
        result = await ocr_service.detect_text(contents)
        return result

    # Bắt các lỗi cụ thể từ Google Vision
    except PermissionDenied as e:
        # Lỗi key không đúng hoặc chưa đủ quyền
        raise HTTPException(status_code=403, detail=str(e))
    except ResourceExhausted as e:
        # Lỗi vượt quota
        raise HTTPException(status_code=429, detail=str(e))
    except InvalidArgument as e:
        # Lỗi file ảnh không hợp lệ
        raise HTTPException(status_code=400, detail=str(e))
    except GoogleAPIError as e:
        # Lỗi chung khác của Google
        # Tùy logic, có thể trả về 502 Bad Gateway, 503 Service Unavailable, v.v.
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        # Lỗi không đoán trước
        raise HTTPException(status_code=500, detail=str(e))
