---
description: >-
  This document provides a structured guide for the RumAI OCR Service API. It
  includes detailed information on the OCR endpoint used to extract text from
  images, along with example requests and response
---

# OCR Service API Documentation

{% hint style="info" %}
The API leverages the Google Vision API for text detection and requires proper authentication using JWT Bearer Tokens.
{% endhint %}

### Base URL

```
http://api.rumai.app
```

***

### 1. Overview

* **Endpoint:** `/v1/ocr/detect-text`
* **Method:** `POST`
* **Purpose:** Extract text from an image using the Google Vision API.
* **Authentication:** Requires a valid Bearer Token (JWT) in the `Authorization` header.

***

### 2. Request Requirements

#### Headers

* **Authorization:**
  * **Type:** Bearer Token
  *   **Example:**

      ```
      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      ```
  * **Note:**
    * The token must be a valid JWT encoded with the secret key and algorithm defined in the backend.
    * The token will also be validated against the Auth Service to ensure it hasn’t expired or been revoked.

#### Body

* **Content-Type:** `multipart/form-data`
* **Parameter:**
  * **file:**
    * **Type:** File
    * **Requirement:** The file must be an image (its Content-Type should start with `image/`).
    * **Note:** Do not send the file as JSON; it must be sent using a `FormData` object.

**Example using `fetch` (JavaScript):**

```js
const formData = new FormData();
formData.append('file', selectedFile); // selectedFile is a File object from an input element

fetch('https://api.rumai.app/v1/ocr/detect-text', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}` // accessToken must be a valid JWT token
    // Do not set the Content-Type header manually. The browser will set it to multipart/form-data with the proper boundary.
  },
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

**Example using `axios`:**

```js
import axios from 'axios';

const formData = new FormData();
formData.append('file', selectedFile);

axios.post('https://api.rumai.app/v1/ocr/detect-text', formData, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
    // Axios will automatically set the Content-Type header for FormData.
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

***

### 3. Response

#### Successful Response (HTTP 200)

* **Response Body:** JSON formatted as follows:

```json
{
  "text": "Full extracted text from the image",
  "details": [
    {
      "text": "Detected text snippet",
      "bounding_box": [
        {"x": 10, "y": 20},
        {"x": 110, "y": 20},
        {"x": 110, "y": 60},
        {"x": 10, "y": 60}
      ]
    }
    // ... more text blocks if available
  ]
}
```

***

### 4. Error Handling

The API returns specific HTTP status codes along with error messages to help the frontend correctly handle failures:

* **400 Bad Request**
  * **When:** The file is not an image (invalid Content-Type) or the image is corrupt/invalid.
  * **Cause:** May be raised as an `InvalidArgument` exception.
* **401 Unauthorized**
  * **When:** The token is missing, invalid, or expired.
  * **Cause:** JWT decoding errors or failed token validation with the Auth Service.
* **403 Forbidden**
  * **When:** There is an authentication error from Google Vision (e.g., invalid credentials or insufficient permissions).
  * **Cause:** Raised as a `PermissionDenied` exception.
* **422 Unprocessable Entity**
  * **When:** The request payload is malformed, such as sending JSON instead of multipart/form-data, or the file field is missing.
  * **Cause:** FastAPI validation errors occur when the input data does not match the expected format.
* **429 Too Many Requests**
  * **When:** The API quota has been exceeded.
  * **Cause:** Raised as a `ResourceExhausted` exception.
* **502 Bad Gateway**
  * **When:** There is a generic error coming from the Google Vision API that does not fall into the above categories.
  * **Cause:** Raised as a `GoogleAPIError` exception.
* **500 Internal Server Error**
  * **When:** An unexpected error occurs that isn’t caught by other exception handlers.

> **Example Error Responses:**\
> If the file is not an image:
>
> ```json
> { "detail": "File must be an image" }
> ```
>
> If the token is invalid:
>
> ```json
> { "detail": "Token is invalid or expired" }
> ```

***

### 5. Notes

* **Ensure Correct Format:**\
  Use `FormData` to send the file instead of JSON to ensure the request is correctly formatted as `multipart/form-data`.
* **Do Not Manually Set Content-Type:**\
  Allow the browser (or your HTTP library like axios) to set the `Content-Type` header automatically with the correct boundary.
* **Handle HTTP Errors:**\
  Implement error handling for HTTP status codes (400, 401, 403, 422, 429, 502, 500) so that appropriate error messages can be displayed to the user.
