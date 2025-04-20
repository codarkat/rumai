import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status, Path
from typing import List, Optional
from datetime import datetime

from app.models.schemas import (
    VocabularyExerciseAdminResponse,
    VocabularyExerciseDBCreate,
    VocabularyExerciseUpdate,
    GenerateExerciseRequest, # Added for the new endpoint
)
from app.api.dependencies import get_current_admin_user, get_db # Added get_db
from app.services.exercise_generator import generate_exercises_via_gemini # Import the generator service
from app.db import crud_exercises # Import CRUD functions

router = APIRouter()

# Mock DB removed, will use actual DB calls now

@router.get("/admin/exercises", response_model=List[VocabularyExerciseAdminResponse], tags=["Admin CRUD"])
async def list_exercises_admin(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    level_filter: Optional[int] = None, # Add level filter
    topic_filter: Optional[str] = None, # Add topic filter
    current_admin: str = Depends(get_current_admin_user), # Protected route
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    List vocabulary exercises for admin view.
    """
    # This part seems correct from the file content, no change needed here.
    # Re-affirming the correct code:
    exercises = await crud_exercises.get_exercises(
        conn=db,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
        level_filter=level_filter,
        topic_filter=topic_filter
    )
    return exercises

@router.post("/admin/exercises", response_model=VocabularyExerciseAdminResponse, status_code=status.HTTP_201_CREATED, tags=["Admin CRUD"])
async def create_exercise_admin(
    exercise_in: VocabularyExerciseDBCreate,
    current_admin: str = Depends(get_current_admin_user), # Protected route
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Create a new vocabulary exercise.
    """
    # This part seems correct from the file content, no change needed here.
    # Re-affirming the correct code:
    created_exercise = await crud_exercises.create_exercise(conn=db, exercise=exercise_in)
    return created_exercise

@router.get("/admin/exercises/{exercise_id}", response_model=VocabularyExerciseAdminResponse, tags=["Admin CRUD"])
async def get_exercise_admin(
    exercise_id: int = Path(..., title="The ID of the exercise to get", gt=0),
    current_admin: str = Depends(get_current_admin_user), # Protected route
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Get a specific vocabulary exercise by ID for admin view.
    """
    # This part seems correct from the file content, no change needed here.
    # Re-affirming the correct code:
    exercise = await crud_exercises.get_exercise_by_id(conn=db, exercise_id=exercise_id)
    if exercise is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    return exercise

@router.put("/admin/exercises/{exercise_id}", response_model=VocabularyExerciseAdminResponse, tags=["Admin CRUD"])
async def update_exercise_admin(
    exercise_update: VocabularyExerciseUpdate,
    exercise_id: int = Path(..., title="The ID of the exercise to update", gt=0),
    current_admin: str = Depends(get_current_admin_user), # Dependency last
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Update a vocabulary exercise.
    """
    # This part seems correct from the file content, no change needed here.
    # Re-affirming the correct code:
    updated_exercise = await crud_exercises.update_exercise(
        conn=db, exercise_id=exercise_id, exercise_update=exercise_update
    )
    if updated_exercise is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    return updated_exercise


@router.delete("/admin/exercises/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin CRUD"])
async def delete_exercise_admin(
    exercise_id: int = Path(..., title="The ID of the exercise to delete", gt=0),
    current_admin: str = Depends(get_current_admin_user), # Protected route
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Delete a vocabulary exercise.
    """
    # This part seems correct from the file content, no change needed here.
    # Re-affirming the correct code:
    deleted = await crud_exercises.delete_exercise(conn=db, exercise_id=exercise_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    # No content response is returned automatically by FastAPI on 204


@router.post("/admin/generate-exercises", response_model=List[VocabularyExerciseAdminResponse], status_code=status.HTTP_201_CREATED, tags=["Admin CRUD"])
async def generate_new_exercises_admin(
    generation_request: GenerateExerciseRequest,
    current_admin: str = Depends(get_current_admin_user), # Protected route
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Generate new vocabulary exercises using the Gemini service and add them to the DB.
    """
    # Removed duplicated docstring lines
    # Corrected code block:
    try:
        # Call the generator service
        generated_items = await generate_exercises_via_gemini(generation_request)

        newly_added_exercises = []
        # Process and save generated items to DB
        for item in generated_items:
            try:
                # Validate and structure data for DB insertion
                exercise_data = VocabularyExerciseDBCreate(
                    level=generation_request.level,
                    topic=generation_request.topic,
                    russian_content=item.get("russian", "N/A"),
                    vietnamese_translation=item.get("vietnamese", "N/A"),
                    options=item.get("options", []),
                    correct_answer=item.get("correct_answer", "N/A"),
                    explanation=item.get("explanation"),
                    status='pending'
                )
                # Save to actual DB
                created_exercise = await crud_exercises.create_exercise(conn=db, exercise=exercise_data)
                newly_added_exercises.append(created_exercise)

            except Exception as validation_error:
                # Log error if a specific item fails validation/processing
                print(f"Skipping item due to error: {validation_error}. Item data: {item}")
                # Optionally raise an error or continue processing others

        if not newly_added_exercises:
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No valid exercises could be generated or processed.")

        return newly_added_exercises

    except HTTPException as http_exc:
        # Re-raise exceptions from the generator service call
        raise http_exc
    except Exception as e:
        print(f"Error during exercise generation endpoint: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to generate exercises: {e}")