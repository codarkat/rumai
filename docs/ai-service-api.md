# RumAI AI Service API Documentation 🤖

This document provides details on the API endpoints available for the RumAI AI Service, including text generation and vision capabilities.

## Base URL

The base URL for the AI Service API is: `https://api.rumai.app`

## Authentication

Most endpoints require authentication using a **Bearer Token** provided in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

Obtain this token via the Authentication Service's `POST /auth/login` endpoint.

---

## 🤖 AI Service Endpoints

### 1. Health Check

*   **Endpoint:** `GET /v1/health`
*   **Summary:** Checks the health status of the AI service.
*   **Authentication:** None required.
*   **Success Response (200 OK):**
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

### 2. Text Generation

*   **Endpoint:** `POST /v1/chat/generate-text`
*   **Summary:** Generates text responses using Gemini models.
*   **Authentication:** Bearer Token required.
*   **Headers:**
    - `X-Google-API-Key`: YOUR_KEY (optional) - If not provided, the service will use the API key specified in the configuration.
*   **Request Body:**
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
*   **Success Response (200 OK):**
    ```json
    {
      "response_text": "AI brings numerous benefits to healthcare, including improved accuracy in diagnoses through medical image analysis, personalized treatment recommendations based on patient data, streamlining administrative processes, predictive analytics about disease outbreaks, and remote patient monitoring capabilities...",
      "model_used": "gemini-2.5-pro-exp-03-25"
    }
    ```
*   **Error Response (401 Unauthorized):** If authentication fails.
*   **Error Response (400 Bad Request):** If parameters are invalid.

### 3. Vision Text Extraction

*   **Endpoint:** `POST /v1/vision/extract-text`
*   **Summary:** Extracts text from images using Gemini Vision models.
*   **Authentication:** Bearer Token required.
*   **Headers:**
    - `X-Google-API-Key`: YOUR_KEY (optional)
*   **Form Data:**
    - `file` (file, required): Image file to extract text from
    - `prompt` (string, optional): Custom extraction prompt
    - `model` (string, optional): Vision model to use (defaults to "gemini-2.0-flash")
*   **Success Response (200 OK):**
    ```json
    {
      "filename": "document.jpg",
      "content_type": "image/jpeg",
      "extracted_text": "Meeting Agenda\n1. Project Updates\n2. Budget Review\n3. Progress Discussion\n4. New Initiatives\n5. Q&A",
      "model_used": "gemini-2.0-flash"
    }
    ```
*   **Error Response (400 Bad Request):** If file format is invalid or file is too large.
*   **Error Response (401 Unauthorized):** If authentication fails.