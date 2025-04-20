from fastapi import APIRouter
from app.models.schemas import HealthCheck

router = APIRouter()

@router.get("/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    """
    Health check endpoint. Returns status 'ok' if the service is running.
    """
    return HealthCheck()