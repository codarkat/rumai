from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from services.ocr_service import get_ocr_service, OCRService
from config import Config
import io

router = APIRouter(
    prefix="/ocr",
    tags=["ocr"]
)

@router.post("/extract")
async def extract_text(
    file: UploadFile = File(...),
    engine: str = Form(Config.DEFAULT_OCR_ENGINE),
    #ocr_service: OCRService = Depends(lambda: get_ocr_service(engine))
):
    """
    Extract text from an uploaded image using the specified OCR engine.
    
    - **file**: The image file to extract text from
    - **engine**: OCR engine to use (easyocr or qwen)
    """
    ocr_service = get_ocr_service(engine)
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        text = await ocr_service.extract_text(contents)
        
        return JSONResponse(
            content={
                "success": True,
                "engine": engine,
                "text": text
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing error: {str(e)}")
