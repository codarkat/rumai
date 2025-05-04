from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from app.api.api import api_router
from app.core.config import get_settings
from app.core.security import close_http_client # Import hàm đóng client

settings = get_settings()

# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Logic to run on startup (if any)
    # E.g., initialize database connections, load models, etc.
    print("AI Service starting up...")
    yield
    # Logic to run on shutdown
    print("AI Service shutting down...")
    await close_http_client()
    print("HTTP client closed.")

# Create FastAPI application with lifespan handler
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan # <<< Use lifespan handler
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include API router
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "Welcome to the Gemini AI Service API",
        "docs": "/docs"
    }

# Add health check endpoint
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
if __name__ == "__main__":
    import uvicorn
    print(f"Starting server. Access API docs at http://127.0.0.1:8810/docs")
    uvicorn.run("main:app", host="127.0.0.1", port=8810, reload=True)
    # reload=True tự động cập nhật khi thay đổi mã - chỉ dùng cho môi trường phát triển