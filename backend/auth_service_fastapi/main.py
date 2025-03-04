# main.py
from fastapi import FastAPI
from routers import auth

app = FastAPI(
    title="RumAI API",
    description="API backend cho dự án RumAI hỗ trợ học tiếng Nga",
    version="0.1.0"
)

# Đăng ký các router
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(exercise.router, prefix="/exercise", tags=["Exercises"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
