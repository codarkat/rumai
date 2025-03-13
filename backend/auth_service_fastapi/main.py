# main.py

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware

from routers import auth
from database import engine, Base, SessionLocal
from config import config
from sqlalchemy.sql import text


PORT = config.PORT

app = FastAPI(
    title="RumAI API",
    description="API Documentation for RumAI",
    version="0.1.0",
    # root_path="/auth",  # Thêm dòng này
    # servers=[
    #     {"url": "/auth", "description": "API Gateway"},
    #     {"url": "http://localhost:8800", "description": "Direct Access"}
    # ]
)

# # Cấu hình CORS cho production
# origins = [
#     "https://your-frontend-domain.com",  # Domain chính thức của frontend
#     "http://localhost:3000",  # Development frontend
# ]


# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)



@app.get("/")
async def root():
    return RedirectResponse(url='/docs')
# @app.get("/")
# async def root():
#     return {
#         "message": "Chào mừng đến với RumAI API Authentication",
#         "docs": "docs",
#         "health": "health"
#     }


@app.get("/health", tags=["Health Check"])
async def health_check():
    try:
        # Tạo session để test database connection
        db = SessionLocal()
        # Thử truy vấn đơn giản
        db.execute(text('SELECT 1'))
        db.close()

        return {
            "status": "healthy",
            "database": "connected",
            "version": "0.1.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


# Tạo bảng khi khởi động
Base.metadata.create_all(bind=engine)

# Đăng ký các router
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(exercise.router, prefix="/exercise", tags=["Exercises"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
