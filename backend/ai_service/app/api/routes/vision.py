from fastapi import Depends
from fastapi import APIRouter, HTTPException, status, Header, File, UploadFile, Form
from typing import Optional
from app.models.schemas import VisionResponse
from app.services.gemini import GeminiService
from app.core.config import get_settings
from app.core.security import verify_token # <<< Import hàm verify_token

router = APIRouter()
settings = get_settings()

@router.post(
    "/vision/extract-text",
    response_model=VisionResponse,
    summary="Extract text from an image using Gemini Vision",
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Bad request, such as invalid parameters or file type"},
        status.HTTP_401_UNAUTHORIZED: {"description": "Authentication required or invalid token"}, # Cập nhật mô tả 401
        status.HTTP_403_FORBIDDEN: {"description": "Permission denied for the operation"},
        status.HTTP_429_TOO_MANY_REQUESTS: {"description": "Quota or rate limit exceeded"},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal server error"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Service temporarily unavailable or Auth service unavailable"} # Cập nhật mô tả 503
    }
)
async def extract_text_from_image(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
    model: Optional[str] = Form(None),
    current_user: dict = Depends(verify_token) # <<< Thêm dependency xác thực
):
    """
    Receives an image file and optional custom prompt, then extracts text 
    from the image using Gemini Vision.
    """
    try:
        # Validate content type
        allowed_content_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_content_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {file.content_type}. Please upload an image (JPEG, PNG, GIF, or WebP)."
            )
        
        # Read the file content
        image_content = await file.read()
        
        # Ensure the file size is not too large (< 10MB)
        if len(image_content) > 10 * 1024 * 1024:  # 10MB in bytes
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded image is too large. Please upload an image smaller than 10MB."
            )
        
        # TODO: Cân nhắc lấy API key từ `current_user` nếu lưu trữ riêng
        # Ví dụ: api_key = current_user.get("gemini_api_key") or settings.GOOGLE_AI_STUDIO_API_KEY
        # Hiện tại vẫn dùng key mặc định từ settings
        api_key = settings.GOOGLE_AI_STUDIO_API_KEY
        if not api_key:
             # Nên có kiểm tra key tồn tại và trả lỗi rõ ràng
             raise HTTPException(status_code=500, detail="Gemini API key is not configured on the server.")

        # Initialize the Gemini service
        gemini_service = GeminiService(api_key=api_key)
        
        # Extract text from the image
        extracted_text, model_used = await gemini_service.extract_text_from_image(
            image_content=image_content,
            model=model,
            prompt=prompt
        )
        
        return VisionResponse(
            filename=file.filename,
            content_type=file.content_type,
            extracted_text=extracted_text,
            model_used=model_used
        )
    except HTTPException as http_exc:
        # Re-raise HTTPExceptions raised by the service
        raise http_exc
    except Exception as e:
        # Catch any other unexpected errors during text extraction
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during text extraction: {e}"
        )