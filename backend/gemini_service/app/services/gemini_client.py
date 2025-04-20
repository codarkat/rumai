import google.generativeai as genai
from app.core.config import settings
from fastapi import HTTPException, status
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiClient:
    """
    A client to interact with the Google Generative AI API (Gemini).
    """

    def configure_sdk(self, api_key: str):
        """Configures the Google Generative AI SDK with the provided API key."""
        try:
            genai.configure(api_key=api_key)
            logger.info("Google Generative AI SDK configured successfully.")
        except Exception as e:
            logger.error(f"Failed to configure Google Generative AI SDK: {e}")
            # Depending on policy, might raise an exception or handle differently
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed to configure external AI service: {e}"
            )

    async def generate_text(self, prompt: str, model_name: str, system_instruction: str | None = None) -> str:
        """
        Generates text content using the specified Gemini model.

        Args:
            prompt: The main user prompt/message.
            model_name: The name of the Gemini model to use.
            system_instruction: Optional system instruction for the model.

        Returns:
            The generated text content as a string.

        Raises:
            HTTPException: If the generation fails or the API returns an error.
        """
        logger.info(f"Attempting to generate text with model: {model_name}")
        try:
            # Initialize the model
            # Handle potential system instructions if the model/API supports it directly
            # Note: As of late 2023/early 2024, direct system_instruction might vary by model/API version.
            # Adjust based on the specific genai library version and model capabilities.
            # For now, we might prepend system instruction to the prompt if needed,
            # or use specific model parameters if available.
            # Example using a basic generation config:
            generation_config = genai.types.GenerationConfig(
                # candidate_count=1, # Usually default is 1
                # temperature=0.7, # Example temperature setting
            )

            # Combine system instruction with prompt if provided and necessary
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt

            model = genai.GenerativeModel(model_name, generation_config=generation_config)

            # Generate content
            response = await model.generate_content_async(full_prompt) # Use async version

            # Extract the text from the response
            # Need to handle potential errors or empty responses from the API
            if response.parts:
                generated_text = "".join(part.text for part in response.parts)
                logger.info(f"Successfully generated text using model {model_name}.")
                return generated_text
            elif response.prompt_feedback and response.prompt_feedback.block_reason:
                 # Handle content blocking
                 block_reason = response.prompt_feedback.block_reason
                 logger.warning(f"Content generation blocked for model {model_name}. Reason: {block_reason}")
                 raise HTTPException(
                     status_code=status.HTTP_400_BAD_REQUEST,
                     detail=f"Content generation blocked by the AI service. Reason: {block_reason}"
                 )
            else:
                # Handle other potential issues like empty response without blocking
                logger.error(f"Received an unexpected or empty response from Gemini model {model_name}.")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Received an empty or unexpected response from the AI service."
                )

        except Exception as e:
            logger.error(f"Error during Gemini text generation with model {model_name}: {e}", exc_info=True)
            # Catch specific API errors if possible from the SDK documentation
            # Re-raise as HTTPException for FastAPI to handle
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while communicating with the AI service: {e}"
            )

# Create a single instance of the client to be used across the application
gemini_client = GeminiClient()