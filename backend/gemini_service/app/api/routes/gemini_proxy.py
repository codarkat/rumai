from fastapi import APIRouter, Depends, HTTPException, Header, status, Body
from typing import Optional
from app.models.schemas import GeminiRequest, GeminiResponse
from app.services.gemini_client import gemini_client # Import the instance
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# --- Dependency for API Key ---
# This approach gets the key per request. Consider optimizing if keys are static.
async def get_api_key(x_api_key: Optional[str] = Header(None, alias="X-API-Key")) -> str:
    """
    Retrieves the Google API Key from the X-API-Key header or default settings.
    Raises HTTPException if no key is available.
    """
    if x_api_key:
        logger.debug("Using API key from X-API-Key header.")
        return x_api_key
    elif settings.DEFAULT_GOOGLE_API_KEY:
        logger.debug("Using default API key from settings.")
        return settings.DEFAULT_GOOGLE_API_KEY
    else:
        logger.error("Missing Google API Key. Provide it via X-API-Key header or DEFAULT_GOOGLE_API_KEY setting.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Google API Key. Set X-API-Key header or configure DEFAULT_GOOGLE_API_KEY.",
        )

@router.post("/generate", response_model=GeminiResponse, tags=["Gemini"])
async def generate_text_endpoint(
    request_body: GeminiRequest = Body(...),
    api_key: str = Depends(get_api_key) # Inject validated API key
):
    """
    Endpoint to generate text using Google Gemini.

    Requires either `X-API-Key` header or `DEFAULT_GOOGLE_API_KEY` in settings.
    """
    try:
        # Configure the SDK with the obtained API key for this request
        # Note: Configuring per request might have overhead. Consider alternatives for production.
        gemini_client.configure_sdk(api_key)

        # Determine the model name to use
        model_to_use = request_body.model_name or settings.DEFAULT_GEMINI_MODEL_NAME
        if not model_to_use:
            logger.error("Missing Gemini model name. Provide it in the request body or DEFAULT_GEMINI_MODEL_NAME setting.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Gemini model name. Set model_name in request or configure DEFAULT_GEMINI_MODEL_NAME.",
            )

        # Call the service to generate text
        generated_content = await gemini_client.generate_text(
            prompt=request_body.message,
            model_name=model_to_use,
            system_instruction=request_body.system_message
        )

        return GeminiResponse(result=generated_content, model_used=model_to_use)

    except HTTPException as http_exc:
        # Re-raise HTTPExceptions directly (e.g., from API key validation or gemini_client)
        raise http_exc
    except Exception as e:
        # Catch any other unexpected errors during the process
        logger.exception(f"Unexpected error in /generate endpoint: {e}") # Log full traceback
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}"
        )