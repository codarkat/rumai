from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from services.ocr_service import OCRService
from typing import List, Dict, Any

from config import config

router = APIRouter(prefix="/ocr", tags=["OCR Services"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Hàm verify token
async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
