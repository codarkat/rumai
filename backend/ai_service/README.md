# Gemini AI Service

A simple and focused API service for Google Gemini models, offering text generation and vision capabilities.

## Features

- **Chat Generation**: Generate text responses using Gemini's advanced language models
- **Vision Processing**: Extract text from images using Gemini Vision
- **Health Monitoring**: Check service health and resource usage

## API Endpoints

### Health Check

Check the service health and system information.

**Endpoint**: `GET /api/v1/health`

**Authentication**: None required

**Response Example**:
```json
{
  "status": "healthy",
  "uptime": "01:23:45",
  "gemini_api": true,
  "system_stats": {
    "cpu_percent": 12.5,
    "memory_percent": 45.2,
    "disk_usage": 68.7
  }
}
```

### Text Generation

Generate text responses using Gemini models.

**Endpoint**: `POST /api/v1/chat/generate-text`

**Authentication**: Optional API key via header

**Headers**:
- `X-Google-API-Key`: YOUR_KEY (optional)

If not provided, the service will use the API key specified in the `.env` file.

**Request Body**:
```json
{
  "message": "What are the benefits of AI in healthcare?",
  "history": [
    {
      "role": "user",
      "content": "Tell me about artificial intelligence."
    },
    {
      "role": "assistant",
      "content": "Artificial Intelligence (AI) refers to systems designed to perform tasks that typically require human intelligence..."
    }
  ],
  "model": "gemini-2.5-pro-exp-03-25"
}
```

**Parameters**:
- `message` (string, required): The user message to generate a response for
- `history` (array, optional): Previous message history to provide context
- `model` (string, optional): Specific model to use (e.g., "gemini-2.5-pro-exp-03-25", "gemini-2.0-flash")

**Response Example**:
```json
{
  "response_text": "AI brings numerous benefits to healthcare, including improved accuracy in diagnoses through medical image analysis, personalized treatment recommendations based on patient data, streamlining administrative processes, predictive analytics about disease outbreaks, and remote patient monitoring capabilities...",
  "model_used": "gemini-2.5-pro-exp-03-25"
}
```

### Vision (Text Extraction)

Extract text from images using Gemini Vision models.

**Endpoint**: `POST /api/v1/vision/extract-text`

**Authentication**: Optional API key via header

**Headers**:
- `X-Google-API-Key`: YOUR_KEY (optional)

**Form Data**:
- `file` (file, required): Image file to extract text from
- `prompt` (string, optional): Custom extraction prompt
- `model` (string, optional): Vision model to use (defaults to "gemini-2.0-flash")

**Response Example**:
```json
{
  "filename": "document.jpg",
  "content_type": "image/jpeg",
  "extracted_text": "Meeting Agenda\n1. Project Updates\n2. Budget Review\n3. Progress Discussion\n4. New Initiatives\n5. Q&A",
  "model_used": "gemini-2.0-flash"
}
```

## Setup and Installation

1. Clone the repository
2. Create a `.env` file with the following variables:
   ```
   GOOGLE_AI_STUDIO_API_KEY=your_google_ai_studio_key
   GEMINI_VISION_MODEL_NAME=gemini-2.0-flash
   GEMINI_CHAT_MODEL_NAME=gemini-2.5-pro-exp-03-25
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the service:
   ```
   uvicorn main:app --reload
   ```

## API Documentation

When the service is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`