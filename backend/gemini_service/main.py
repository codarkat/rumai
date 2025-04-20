from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import health, gemini_proxy # Import the new router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(gemini_proxy.router, prefix=settings.API_V1_STR, tags=["Gemini"]) # Include the new router

@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint providing basic service information.
    """
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

# Add middleware, exception handlers, etc. here if needed

if __name__ == "__main__":
    import uvicorn
    # Note: For production, run with a proper ASGI server like Uvicorn or Hypercorn
    # Example: uvicorn main:app --host 0.0.0.0 --port 8000 --reload (for development)
    # Using port 8001 for this service as an example, adjust if needed
    uvicorn.run(app, host="0.0.0.0", port=8001)