from fastapi import FastAPI, Depends
from app.core.config import settings
from app.api.routes import health, admin_auth, admin_exercises, exercises # Import the new public exercises router
from app.api.dependencies import get_current_admin_user # Import the dependency
from app.db.session import create_pool, close_pool, db_pool # Import pool management functions AND the pool variable
from app.db.init_db import create_tables_if_not_exist # Import table creation function

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# --- Database Connection Pool Management ---
@app.on_event("startup")
async def startup_event():
    """Create the database connection pool and tables on startup."""
    await create_pool()
    # Ensure pool was created before trying to create tables
    if db_pool:
        async with db_pool.acquire() as conn:
            await create_tables_if_not_exist(conn)
    else:
        # Handle error: pool creation failed, maybe log or raise
        print("ERROR: Database pool not created, cannot initialize tables.")

@app.on_event("shutdown")
async def shutdown_event():
    """Close the database connection pool on shutdown."""
    await close_pool()
# --- End Database Connection Pool Management ---


# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(admin_auth.router, prefix=settings.API_V1_STR) # Include admin auth router (no protection needed here)
app.include_router(
    admin_exercises.router,
    prefix=settings.API_V1_STR,
    tags=["Admin CRUD"],
    dependencies=[Depends(get_current_admin_user)] # Apply auth dependency to all routes in admin_exercises
)
app.include_router(exercises.router, prefix=settings.API_V1_STR, tags=["Exercises"]) # Include public exercise routes


@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint providing basic service information.
    """
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

# Add middleware, exception handlers, etc. here if needed

if __name__ == "__main__":
    import uvicorn
    # Using port 8002 for this service as an example, adjust if needed
    uvicorn.run(app, host="0.0.0.0", port=8002)