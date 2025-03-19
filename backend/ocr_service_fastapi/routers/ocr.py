from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from services.ocr_service import OCRService
from typing import List, Dict, Any

router = APIRouter(prefix="/ocr", tags=["OCR Services"])


@router.post("/detect-text")
async def detect_text(file: UploadFile = File(...)):
    """
    API endpoint để nhận dạng văn bản từ hình ảnh được tải lên
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File phải là hình ảnh")

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
