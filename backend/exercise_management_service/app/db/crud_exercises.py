import asyncpg
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.models.schemas import (
    VocabularyExerciseDB,
    VocabularyExerciseDBCreate,
    VocabularyExerciseUpdate,
    VocabularyExerciseAdminResponse # Used for mapping result
)

logger = logging.getLogger(__name__)

# Helper to map asyncpg Record to Pydantic model
def map_record_to_exercise_db(record: asyncpg.Record) -> VocabularyExerciseAdminResponse:
    # Assuming the schema fields match the column names
    # Handle potential JSONB parsing if options are stored as text (though JSONB is better)
    return VocabularyExerciseAdminResponse(**dict(record))

async def get_exercise_by_id(conn: asyncpg.Connection, exercise_id: int) -> Optional[VocabularyExerciseAdminResponse]:
    """Fetches a single exercise by its ID."""
    logger.debug(f"Fetching exercise with id: {exercise_id}")
    query = "SELECT * FROM vocabulary_exercises WHERE id = $1"
    record = await conn.fetchrow(query, exercise_id)
    if record:
        return map_record_to_exercise_db(record)
    return None

async def get_exercises(
    conn: asyncpg.Connection,
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    level_filter: Optional[int] = None,
    topic_filter: Optional[str] = None
) -> List[VocabularyExerciseAdminResponse]:
    """Fetches a list of exercises with optional filters and pagination."""
    logger.debug(f"Fetching exercises with skip={skip}, limit={limit}, status={status_filter}, level={level_filter}, topic={topic_filter}")
    base_query = "SELECT * FROM vocabulary_exercises"
    conditions = []
    args = []
    arg_counter = 1

    if status_filter:
        conditions.append(f"status = ${arg_counter}")
        args.append(status_filter)
        arg_counter += 1
    if level_filter is not None:
        conditions.append(f"level = ${arg_counter}")
        args.append(level_filter)
        arg_counter += 1
    if topic_filter:
        # Use ILIKE for case-insensitive partial matching
        conditions.append(f"topic ILIKE ${arg_counter}")
        args.append(f"%{topic_filter}%")
        arg_counter += 1

    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)

    base_query += f" ORDER BY created_at DESC OFFSET ${arg_counter} LIMIT ${arg_counter + 1}"
    args.extend([skip, limit])

    records = await conn.fetch(base_query, *args)
    return [map_record_to_exercise_db(record) for record in records]


async def create_exercise(conn: asyncpg.Connection, exercise: VocabularyExerciseDBCreate) -> VocabularyExerciseAdminResponse:
    """Creates a new exercise entry in the database."""
    logger.info(f"Creating new exercise for topic: {exercise.topic}")
    query = """
        INSERT INTO vocabulary_exercises (level, topic, russian_content, vietnamese_translation, options, correct_answer, explanation, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10)
        RETURNING *;
    """
    now = datetime.now(datetime.timezone.utc)
    # Convert options list to JSON string for asyncpg if needed, though it handles lists for jsonb
    # options_json = json.dumps(exercise.options)

    record = await conn.fetchrow(
        query,
        exercise.level,
        exercise.topic,
        exercise.russian_content,
        exercise.vietnamese_translation,
        exercise.options, # Pass list directly for jsonb
        exercise.correct_answer,
        exercise.explanation,
        exercise.status,
        now,
        now
    )
    if not record:
         # This shouldn't happen with RETURNING * unless insert failed silently
         raise RuntimeError("Failed to create exercise, no record returned.")
    logger.info(f"Successfully created exercise with id: {record['id']}")
    return map_record_to_exercise_db(record)


async def update_exercise(conn: asyncpg.Connection, exercise_id: int, exercise_update: VocabularyExerciseUpdate) -> Optional[VocabularyExerciseAdminResponse]:
    """Updates an existing exercise."""
    logger.info(f"Updating exercise with id: {exercise_id}")
    # Fetch the existing exercise first to ensure it exists
    existing = await get_exercise_by_id(conn, exercise_id)
    if not existing:
        return None

    # Prepare the update query dynamically based on provided fields
    update_data = exercise_update.model_dump(exclude_unset=True)
    if not update_data:
        # No fields to update, return existing
        return existing

    set_clauses = []
    args = []
    arg_counter = 1

    for key, value in update_data.items():
        # Special handling for options if needed (e.g., converting to JSON string)
        if key == "options":
             set_clauses.append(f"options = ${arg_counter}::jsonb")
             args.append(value) # Pass list directly
        else:
             set_clauses.append(f"{key} = ${arg_counter}")
             args.append(value)
        arg_counter += 1

    # Add updated_at timestamp
    set_clauses.append(f"updated_at = ${arg_counter}")
    args.append(datetime.now(datetime.timezone.utc))
    arg_counter += 1

    # Add the ID for the WHERE clause
    args.append(exercise_id)

    query = f"""
        UPDATE vocabulary_exercises
        SET {', '.join(set_clauses)}
        WHERE id = ${arg_counter}
        RETURNING *;
    """

    record = await conn.fetchrow(query, *args)
    if not record:
         # Should not happen if the initial check passed, but good safeguard
         raise RuntimeError(f"Failed to update exercise {exercise_id}, no record returned.")
    logger.info(f"Successfully updated exercise with id: {exercise_id}")
    return map_record_to_exercise_db(record)


async def delete_exercise(conn: asyncpg.Connection, exercise_id: int) -> bool:
    """Deletes an exercise by its ID. Returns True if deleted, False otherwise."""
    logger.warning(f"Attempting to delete exercise with id: {exercise_id}") # Warning level for deletion
    query = "DELETE FROM vocabulary_exercises WHERE id = $1 RETURNING id;"
    deleted_id = await conn.fetchval(query, exercise_id)
    if deleted_id == exercise_id:
        logger.info(f"Successfully deleted exercise with id: {exercise_id}")
        return True
    logger.warning(f"Exercise with id {exercise_id} not found for deletion.")
    return False

# Add functions for public exercise fetching if needed (e.g., filtering only approved, selecting random)
async def get_public_exercises_db(
    conn: asyncpg.Connection,
    level: Optional[int] = None,
    topic: Optional[str] = None,
    count: int = 10
) -> List[Dict]: # Return dicts to easily exclude fields later
    """Fetches approved exercises for public view, selecting randomly."""
    logger.debug(f"Fetching public exercises with level={level}, topic={topic}, count={count}")
    base_query = "SELECT id, level, topic, russian_content, options, explanation FROM vocabulary_exercises" # Select only needed fields
    conditions = ["status = 'approved'"] # Always filter by approved
    args = []
    arg_counter = 1

    if level is not None:
        conditions.append(f"level = ${arg_counter}")
        args.append(level)
        arg_counter += 1
    if topic:
        conditions.append(f"topic ILIKE ${arg_counter}")
        args.append(f"%{topic}%")
        arg_counter += 1

    base_query += " WHERE " + " AND ".join(conditions)
    # Use ORDER BY random() for random selection (might be slow on large tables)
    # Alternatively, fetch more than needed and sample in Python, or use TABLESAMPLE
    base_query += f" ORDER BY random() LIMIT ${arg_counter}"
    args.append(count)

    records = await conn.fetch(base_query, *args)
    # Return as list of dicts for flexibility in route
    return [dict(record) for record in records]