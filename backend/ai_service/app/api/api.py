from fastapi import APIRouter
from app.api.routes import health, chat, vision
from app.core.config import get_settings

settings = get_settings()

# Create API router with prefix
api_router = APIRouter(prefix=settings.API_V1_STR)

# Include all route modules
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(chat.router, tags=["Chat"])
api_router.include_router(vision.router, tags=["Vision"])