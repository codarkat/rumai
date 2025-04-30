from fastapi import APIRouter, status
import time
import psutil
from app.core.config import get_settings
from app.models.schemas import HealthResponse
import google.generativeai as genai

router = APIRouter()
settings = get_settings()

# Track when the server started
START_TIME = time.time()

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check the health of the service and get system information",
    status_code=status.HTTP_200_OK
)
async def health_check():
    """
    Health check endpoint that returns:
    - Service status
    - Uptime
    - Gemini API connectivity status
    - System resource usage stats
    """
    # Calculate uptime
    uptime_seconds = int(time.time() - START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_formatted = f"{hours:02}:{minutes:02}:{seconds:02}"
    
    # Check if Gemini API is reachable
    gemini_api_status = False
    try:
        if settings.GOOGLE_AI_STUDIO_API_KEY:
            genai.configure(api_key=settings.GOOGLE_AI_STUDIO_API_KEY)
            models = genai.list_models()
            gemini_api_status = any("gemini" in model.name.lower() for model in models)
    except Exception:
        gemini_api_status = False
    
    # Collect system stats
    system_stats = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent
    }
    
    return HealthResponse(
        status="healthy",
        uptime=uptime_formatted,
        gemini_api=gemini_api_status,
        system_stats=system_stats
    )