from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import ocr
from config import config

app = FastAPI(
    title=config.PROJECT_NAME,
    description="API service for extracting text from images using multiple OCR engines",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ocr.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to OCR API Service",
        "docs": "/docs",
        "health": "/api/v1/ocr/health"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, reload=True)
