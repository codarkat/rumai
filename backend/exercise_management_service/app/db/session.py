import asyncpg
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

# Global variable to hold the connection pool
db_pool = None

async def create_pool():
    """Creates the asyncpg connection pool."""
    global db_pool
    if db_pool is None:
        logger.info(f"Creating database connection pool for {settings.DATABASE_URL}")
        try:
            db_pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=5,  # Minimum number of connections in the pool
                max_size=20, # Maximum number of connections in the pool
                # Add other pool options if needed, e.g., command_timeout
            )
            logger.info("Database connection pool created successfully.")
            # Optional: Test connection
            # async with db_pool.acquire() as connection:
            #     val = await connection.fetchval('SELECT 1')
            #     if val == 1:
            #         logger.info("Database connection test successful.")
            #     else:
            #         logger.warning("Database connection test returned unexpected value.")
        except Exception as e:
            logger.exception(f"Failed to create database connection pool: {e}")
            # Depending on policy, you might want to exit the application or retry
            db_pool = None # Ensure pool is None if creation failed
            raise # Re-raise the exception to potentially stop startup

async def close_pool():
    """Closes the asyncpg connection pool."""
    global db_pool
    if db_pool:
        logger.info("Closing database connection pool.")
        await db_pool.close()
        db_pool = None
        logger.info("Database connection pool closed.")

async def get_db_connection():
    """Dependency to get a connection from the pool."""
    if db_pool is None:
        logger.error("Database pool is not initialized.")
        raise RuntimeError("Database pool is not initialized. Application might not have started correctly.")
    async with db_pool.acquire() as connection:
        yield connection # Yield the connection for the route to use