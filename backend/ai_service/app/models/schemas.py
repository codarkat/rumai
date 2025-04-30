from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    """Represents a single message in the chat history."""
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    """Request model for the chat endpoint."""
    message: str  # The new message from the user
    history: list[ChatMessage] = []  # Optional chat history
    model: str | None = None  # Optional model name

class ChatResponse(BaseModel):
    """Response model for the chat endpoint."""
    response_text: str
    model_used: str

class VisionResponse(BaseModel):
    """Response model for the vision endpoint."""
    filename: str
    content_type: str
    extracted_text: str
    model_used: str

class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""
    status: str
    uptime: str
    gemini_api: bool
    system_stats: dict