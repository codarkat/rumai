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
            # Initialize the model with basic generation config
            generation_config = genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
                top_k=40,
                max_output_tokens=8192,
            )

            # Safety settings - use default settings provided by the API
            safety_settings = None  # Let the API use its default safety settings

            # Create the model
            try:
                model = genai.GenerativeModel(
                    model_name=model_name,
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
            except ValueError as e:
                logger.error(f"Invalid model name '{model_name}': {e}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid model name: {model_name}. Error: {e}"
                )

            # Prepare content based on whether we have a system instruction
            if system_instruction:
                # Combine system instruction with prompt since many models 
                # don't directly support system instructions
                full_prompt = f"System instruction: {system_instruction}\n\nUser request: {prompt}"
                response = await model.generate_content_async(full_prompt)
            else:
                # Simple content generation without system instruction
                response = await model.generate_content_async(prompt)

            # Extract the text from the response
            if response and hasattr(response, 'text'):
                generated_text = response.text
                logger.info(f"Successfully generated text using model {model_name}.")
                return generated_text
            elif response and hasattr(response, 'parts') and response.parts:
                generated_text = "".join(part.text for part in response.parts if hasattr(part, 'text'))
                logger.info(f"Successfully generated text using model {model_name}.")
                return generated_text
            elif response and hasattr(response, 'prompt_feedback') and response.prompt_feedback and hasattr(response.prompt_feedback, 'block_reason'):
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