import asyncpg
import logging

logger = logging.getLogger(__name__)

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS vocabulary_exercises (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4),
    topic VARCHAR(255) NOT NULL,
    russian_content TEXT NOT NULL,
    vietnamese_translation TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""

# Optional: Add indexes for frequently queried columns
CREATE_INDEX_LEVEL_STATUS_SQL = """
CREATE INDEX IF NOT EXISTS idx_vocabulary_exercises_level_status ON vocabulary_exercises (level, status);
"""
CREATE_INDEX_TOPIC_STATUS_SQL = """
CREATE INDEX IF NOT EXISTS idx_vocabulary_exercises_topic_status ON vocabulary_exercises (topic, status);
"""

async def create_tables_if_not_exist(conn: asyncpg.Connection):
    """
    Creates the necessary tables and indexes if they don't already exist.
    """
    logger.info("Checking and creating database tables if they do not exist...")
    try:
        async with conn.transaction():
            await conn.execute(CREATE_TABLE_SQL)
            await conn.execute(CREATE_INDEX_LEVEL_STATUS_SQL)
            await conn.execute(CREATE_INDEX_TOPIC_STATUS_SQL)
        logger.info("Database tables and indexes checked/created successfully.")
    except Exception as e:
        logger.exception(f"Failed to create database tables/indexes: {e}")
        # Depending on policy, might want to raise the exception to halt startup
        raise