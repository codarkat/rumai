import google.generativeai as genai
import google.api_core.exceptions
from google.generativeai.types import generation_types
from typing import AsyncGenerator, Tuple
from app.core.config import get_settings
from app.models.schemas import ChatMessage
from fastapi import HTTPException, status

settings = get_settings()


class GeminiService:
    def __init__(self, api_key: str | None = None, model: str | None = None):
        self.genai_model = None
        self.api_key = api_key or settings.GOOGLE_AI_STUDIO_API_KEY
        self.model_id = model or settings.GEMINI_CHAT_MODEL_NAME
        self._initialize_model()

    def _initialize_model(self):
        if not self.api_key:
            raise ValueError("Google Gemini API key is not set")

        genai.configure(api_key=self.api_key)
        try:
            self.genai_model = genai.GenerativeModel(self.model_id)
        except Exception as e:
            raise ValueError(f"Failed to initialize Gemini model '{self.model_id}': {e}")

    async def generate_text_response(
        self,
        message: str,
        history: list[ChatMessage],
        model: str | None = None
    ) -> tuple[str, str]:
        """
        Generate a text response using Gemini.
        Returns a tuple of (response_text, model_used).
        """
        # Determine which model to use
        target_model_id = model or self.model_id
        try:
            if target_model_id != self.model_id:
                # Initialize a new model instance if a different model is requested
                model_to_use = genai.GenerativeModel(target_model_id)
            else:
                # Use the already initialized model
                model_to_use = self.genai_model
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed to initialize requested Gemini model '{target_model_id}': {e}"
            )

        if not model_to_use:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Gemini chat model '{target_model_id}' could not be used."
            )

        # Format history for the Gemini API
        # The API expects a list of dicts with 'role' and 'parts' (where parts is a list of strings)
        # Convert history: map 'assistant' role to 'model' for Google API
        formatted_history = [
            {"role": "model" if msg.role == "assistant" else msg.role, "parts": [msg.content]}
            for msg in history
        ]

        try:
            # Start a chat session with the provided history
            chat = model_to_use.start_chat(history=formatted_history)
            response = chat.send_message(message)

            # Check for empty/blocked response
            if not response.parts:
                if response.prompt_feedback.block_reason:
                    raise generation_types.BlockedPromptException(f"Prompt blocked due to {response.prompt_feedback.block_reason.name}")
                else:
                    return "Model did not provide a response.", target_model_id

            # Return both the text and the actual model ID used
            return response.text, target_model_id

        except generation_types.BlockedPromptException as e:
            # Safety filter block
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Chat content blocked by Gemini safety filters: {e}")
        except google.api_core.exceptions.PermissionDenied as e:
            # Map PermissionDenied (403)
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Gemini Permission Denied: {e}")
        except google.api_core.exceptions.ResourceExhausted as e:
            # Map ResourceExhausted (429)
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=f"Gemini Quota/Rate Limit Exceeded: {e}")
        except google.api_core.exceptions.InvalidArgument as e:
            # Map InvalidArgument (400)
            if "api key not valid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Gemini API Key: {e}")
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid Argument to Gemini: {e}")
        except google.api_core.exceptions.Unauthenticated as e:
            # Map Unauthenticated (401)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Gemini Authentication Failed: {e}")
        except Exception as e:
            # Catch-all for other unexpected errors
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error generating chat response with Gemini: {e}")

    async def extract_text_from_image(
        self,
        image_content: bytes,
        model: str | None = None,
        prompt: str | None = None
    ) -> tuple[str, str]:
        """
        Extract text from image using Gemini Vision.
        Returns a tuple of (extracted_text, model_used).
        """
        # Default prompt for text extraction if none is provided
        default_prompt = "Extract all visible text from this image. Return only the text content."
        used_prompt = prompt or default_prompt
        
        # Determine which vision model to use
        target_model_id = model or settings.GEMINI_VISION_MODEL_NAME
        
        try:
            # Initialize the vision model
            vision_model = genai.GenerativeModel(target_model_id)
            
            # Send the image to Gemini
            response = vision_model.generate_content([used_prompt, {"mime_type": "image/jpeg", "data": image_content}])
            
            # Check for empty/blocked response
            if not response.parts:
                if response.prompt_feedback.block_reason:
                    raise generation_types.BlockedPromptException(f"Prompt blocked due to {response.prompt_feedback.block_reason.name}")
                else:
                    return "No text was extracted from the image.", target_model_id
            
            # Return both the extracted text and the model used
            return response.text, target_model_id
            
        except generation_types.BlockedPromptException as e:
            # Safety filter block
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Vision request blocked by Gemini safety filters: {e}")
        except google.api_core.exceptions.PermissionDenied as e:
            # Map PermissionDenied (403)
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Gemini Vision Permission Denied: {e}")
        except google.api_core.exceptions.ResourceExhausted as e:
            # Map ResourceExhausted (429)
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=f"Gemini Vision Quota/Rate Limit Exceeded: {e}")
        except google.api_core.exceptions.InvalidArgument as e:
            # Map InvalidArgument (400)
            if "api key not valid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Gemini API Key for vision: {e}")
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid Vision Request to Gemini: {e}")
        except google.api_core.exceptions.Unauthenticated as e:
            # Map Unauthenticated (401)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Gemini Vision Authentication Failed: {e}")
        except Exception as e:
            # Catch-all for other unexpected errors
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error during vision processing with Gemini: {e}")