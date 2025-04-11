# Gemini AI Integration for Vocabulary Tests

This document explains how the Russian language learning application uses Gemini AI to generate vocabulary tests.

## Overview

The application uses Google's Gemini AI to generate dynamic vocabulary tests tailored to a user's proficiency level. The implementation has the following components:

1. **Vocabulary Service**: A service to interface with the Gemini AI API
2. **API Endpoint**: A server endpoint to securely provide API credentials
3. **Test UI**: A user interface that displays the AI-generated tests

## Setup

1. Get a Gemini API key from Google AI Studio (https://ai.google.dev/)
2. Add the API key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

## How It Works

1. **Test Generation**:

   - When a user starts a vocabulary test, the application calls Gemini AI
   - The prompt requests a structured vocabulary test (20 questions) based on the user's level
   - Gemini AI generates questions with Russian words, Vietnamese translations, and multiple choice options
   - The response is validated and formatted for the test interface

2. **Adaptive Difficulty**:

   - Tests are generated based on the user's Russian proficiency level (A1-C2)
   - The application tracks user performance to refine future test generation

3. **Fallback Mechanism**:
   - If Gemini AI is unavailable, the application uses a predefined set of 20 vocabulary questions
   - This ensures the feature works even when the AI service is unreachable

## Implementation Details

### Prompt Engineering

The prompt to Gemini AI is structured to ensure consistent and useful vocabulary tests:

```
Generate a vocabulary test for Russian language learners at level ${level}.
Please create ${count} questions about the topic "${topic}".

Each question should have a Russian word, its Vietnamese translation, and 4 possible Vietnamese options to choose from.
The correct answer should match the Vietnamese translation.

Format the response as a valid JSON array with the following structure for each item:
{
  "id": number,
  "russian": "Russian word",
  "vietnamese": "Vietnamese translation",
  "options": ["option1", "option2", "option3", "option4"],
  "correct_answer": "The correct Vietnamese translation"
}
```

### Response Processing

The service processes the AI response to extract the structured data:

1. Parse the text response to extract the JSON array
2. Validate each item has the required structure
3. Ensure the correct answer is included in the options

## Test Format

- **Number of Questions**: 20 questions per test
- **Time Limit**: 40 minutes (2 minutes per question on average)
- **Question Format**: Multiple choice with 4 options
- **Support for**: Russian to Vietnamese and Vietnamese to Russian modes

## Future Improvements

- Support for themed vocabulary tests (e.g., food, travel, business)
- Voice pronunciation for Russian words
- Adaptive test difficulty based on real-time performance
- Expanded test formats (fill-in-blanks, sentence completion)
