from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm # Use standard form for login
from datetime import timedelta

from app.models.schemas import Token, AdminLogin # Import relevant schemas
from app.core.config import settings
from app.core.security import verify_password, create_access_token

router = APIRouter()

# Dummy function to simulate getting admin user - replace with actual user lookup if needed
# For now, we just compare against the configured admin credentials
def get_admin_user(username: str):
    if username == settings.ADMIN_USERNAME:
        # In a real app, you'd fetch user data (e.g., hashed password) from DB
        return {"username": settings.ADMIN_USERNAME, "password": settings.ADMIN_PASSWORD}
    return None

@router.post("/admin/login", response_model=Token, tags=["Admin Auth"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Admin login endpoint. Takes username and password via form data.
    Returns a JWT access token upon successful authentication.
    """
    # In this simple case, we directly compare with configured credentials.
    # For a real user system, you'd fetch the user by username and verify the hashed password.
    is_valid_username = form_data.username == settings.ADMIN_USERNAME
    # IMPORTANT: In a real scenario, NEVER compare plain text passwords directly like this.
    # You should fetch the *hashed* password for the user and use verify_password.
    # This is simplified because we only have one admin defined in config.
    is_valid_password = form_data.password == settings.ADMIN_PASSWORD # Simplified check

    # Example using verify_password if we had a hashed password stored:
    # admin_user = get_admin_user(form_data.username) # Fetch user (including hashed pass)
    # if not admin_user or not verify_password(form_data.password, admin_user['hashed_password']):
    #     raise HTTPException(...)

    if not (is_valid_username and is_valid_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}