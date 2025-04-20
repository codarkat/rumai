import asyncpg
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.models.schemas import TokenData
from app.core.config import settings # To potentially check against configured admin user
from app.db.session import get_db_connection # Import the DB connection getter

# OAuth2 scheme definition
# tokenUrl should point to the login endpoint relative to the API root
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/admin/login") # Adjusted tokenUrl

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

async def get_current_admin_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency to validate the JWT token and return the admin username.
    Raises HTTPException if the token is invalid or doesn't correspond to the admin.
    """
    token_data = decode_access_token(token)
    if token_data is None or token_data.username is None:
        raise credentials_exception

    # Verify if the username from the token matches the configured admin username
    # In a multi-user system, you'd fetch the user from DB based on token_data.username
    if token_data.username != settings.ADMIN_USERNAME:
        # This case should ideally not happen if tokens are generated correctly,
        # but it's a safeguard.
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User identified by token is not the authorized admin.",
        )

    # Return the validated admin username
    return token_data.username

# --- Database Dependency ---
async def get_db() -> asyncpg.Connection:
    """Dependency that provides a database connection for a request."""
    async for connection in get_db_connection():
        yield connection
    # The connection is automatically released by the context manager in get_db_connection
# --- End Database Dependency ---