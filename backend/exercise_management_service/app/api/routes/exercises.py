import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from typing import List, Optional
import random

from app.models.schemas import (
    VocabularyExerciseResponse, # Schema for public view (no answers)
    GetExercisesRequest,
    MixedSetRequest,
)
from app.api.dependencies import get_db # Import DB dependency
from app.db import crud_exercises # Import CRUD functions
# Mock DB import removed

router = APIRouter()

@router.get("/exercises", response_model=List[VocabularyExerciseResponse], tags=["Exercises"])
async def get_public_exercises(
    level: Optional[int] = Query(None, ge=1, le=4, description="Filter by level (1-4)"),
    topic: Optional[str] = Query(None, description="Filter by topic"),
    count: int = Query(10, gt=0, description="Number of exercises to return"),
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Get a list of approved vocabulary exercises based on criteria.
    """
    # Fetch from DB using the dedicated public function
    exercise_dicts = await crud_exercises.get_public_exercises_db(
        conn=db, level=level, topic=topic, count=count
    )
    # Convert dicts to the response model
    public_results = [VocabularyExerciseResponse(**ex_dict) for ex_dict in exercise_dicts]
    return public_results

@router.post("/exercises/mixed-set", response_model=List[VocabularyExerciseResponse], tags=["Exercises"])
async def get_mixed_set_exercises(
    mixed_request: MixedSetRequest = Body(...),
    db: asyncpg.Connection = Depends(get_db) # Inject DB connection
):
    """
    Get a mixed set of approved vocabulary exercises based on multiple criteria.
    """
    final_results_set = set() # Use a set to avoid duplicate exercise IDs
    final_results_list = []

    # We'll fetch for each request item individually using the public DB function

    # This approach fetches potentially more than needed per sub-request and then filters.
    # Could be optimized further depending on expected usage patterns.
    for request_item in mixed_request.requests:
        # Fetch exercises matching the current criteria
        # Note: get_public_exercises_db already handles random order and limit
        fetched_exercises = await crud_exercises.get_public_exercises_db(
            conn=db,
            level=request_item.level,
            topic=request_item.topic,
            count=request_item.count # Fetch up to the count needed for this part
        )

        # Add fetched exercises to the final list if not already present
        count_added_for_this_request = 0
        for ex_dict in fetched_exercises:
            if count_added_for_this_request >= request_item.count:
                break # Stop if we've added enough for this specific request item
            if ex_dict['id'] not in final_results_set:
                public_exercise = VocabularyExerciseResponse(**ex_dict)
                final_results_list.append(public_exercise)
                final_results_set.add(ex_dict['id'])
                count_added_for_this_request += 1

        # Note: This logic might not strictly guarantee the *exact* count per category
        # if there's overlap and limited unique exercises. It prioritizes fulfilling
        # each request item as much as possible without duplicates overall.

    # Optionally shuffle the final combined list
    random.shuffle(final_results_list)

    return final_results_list