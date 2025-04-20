from fastapi import APIRouter
from app.models.schemas import HealthCheck

router = APIRouter()

@router.get("/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    """
    Health check endpoint. Returns status 'ok' if the service is running.
    """
    # TODO: Add database connection check here later for a more comprehensive health check
    return HealthCheck()