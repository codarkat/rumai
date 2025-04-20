from pydantic import BaseModel, Field, Json
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Database Model (Reflects table structure) ---
# Note: This might be better placed in a dedicated db/models.py if using an ORM like SQLAlchemy
# For now, keeping it here for simplicity as a reference schema.
class VocabularyExerciseDBBase(BaseModel):
    level: int = Field(..., ge=1, le=4) # 1-Beginner, 2-Basic, 3-Conversational, 4-Professional
    topic: str
    russian_content: str
    vietnamese_translation: str
    options: List[str] # Stored as JSONB in DB, parsed as List here
    correct_answer: str
    explanation: Optional[str] = None
    status: str = Field(default='pending') # 'pending', 'approved', 'rejected'

class VocabularyExerciseDBCreate(VocabularyExerciseDBBase):
    pass # Inherits all fields from base

class VocabularyExerciseDB(VocabularyExerciseDBBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # For compatibility if using SQLAlchemy later

# --- API Request/Response Schemas ---

class GenerateExerciseRequest(BaseModel):
    """
    Schema for requesting vocabulary exercise generation via Gemini.
    """
    level: int = Field(..., ge=1, le=4, description="Difficulty level (1-4)")
    count: int = Field(default=10, gt=0, description="Number of exercises to generate")
    topic: str = Field(default="general", description="Topic for the vocabulary")

class VocabularyExerciseBase(BaseModel):
    """ Base schema for exercise data in API responses """
    level: int
    topic: str
    russian_content: str
    options: List[str]
    explanation: Optional[str] = None

class VocabularyExerciseResponse(VocabularyExerciseBase):
    """
    Schema for representing a single vocabulary exercise in API responses for users.
    """
    id: int
    # Excludes vietnamese_translation and correct_answer for standard user view during test
    class Config:
        orm_mode = True

class VocabularyExerciseAdminResponse(VocabularyExerciseBase):
    """
    Schema for representing a vocabulary exercise in Admin API responses.
    Includes all details for review.
    """
    id: int
    vietnamese_translation: str
    correct_answer: str
    status: str
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class VocabularyExerciseUpdate(BaseModel):
    """ Schema for updating an exercise (Admin) """
    level: Optional[int] = Field(None, ge=1, le=4)
    topic: Optional[str] = None
    russian_content: Optional[str] = None
    vietnamese_translation: Optional[str] = None
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    status: Optional[str] = None # Allow updating status ('approved', 'rejected')

class GetExercisesRequest(BaseModel):
    """
    Schema for requesting a set of exercises based on criteria.
    """
    level: Optional[int] = Field(None, ge=1, le=4)
    topic: Optional[str] = None
    count: int = Field(default=10, gt=0)
    status: str = Field(default='approved', description="Filter by status (usually 'approved' for frontend)")

class MixedSetRequestItem(BaseModel):
    """
    Schema for one item in the mixed set request array.
    """
    level: int = Field(..., ge=1, le=4)
    count: int = Field(..., gt=0)
    topic: str

class MixedSetRequest(BaseModel):
    """
    Schema for the request body of the mixed set endpoint.
    """
    requests: List[MixedSetRequestItem]

class HealthCheck(BaseModel):
    """
    Schema for the health check response.
    """
    status: str = "ok"

# --- Admin Authentication Schemas ---

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None