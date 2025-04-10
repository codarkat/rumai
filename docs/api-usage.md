# RumAI API Documentation - Authentication Service 🔑

This document provides details on the API endpoints available for the RumAI Authentication Service, including user management, authentication flows, and exam time tracking.

## Base URL

The base URL for the Authentication Service API is: `https://api.rumai.app`

## Authentication

Most endpoints require authentication using a **Bearer Token** provided in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

Obtain this token via the `POST /auth/login` endpoint.

---

## 👤 User & Authentication Endpoints

### 1. User Registration

*   **Endpoint:** `POST /auth/register`
*   **Summary:** Registers a new user account.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "username": "string (optional)",
      "email": "user@example.com",
      "password": "yourpassword",
      "full_name": "User Full Name",
      "gemini_api_key": "your_gemini_api_key (optional)"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Registration successful",
      "user": {
        "id": "uuid",
        "username": "string",
        "email": "user@example.com",
        "full_name": "User Full Name",
        "is_active": true,
        // Other profile fields initialized as null/default
        "age": null,
        "gender": null,
        "russian_level": null,
        "gemini_api_key": null,
        "time_start": null,
        "duration": null,
        "time_end": null
      }
    }
    ```
*   **Error Response (400 Bad Request):** If email or username already exists.
    ```json
    { "detail": "Registration failed. Email or username already exists." }
    ```

### 2. User Login

*   **Endpoint:** `POST /auth/login`
*   **Summary:** Authenticates a user and returns access and refresh tokens.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "access_token": "string",
      "refresh_token": "string",
      "token_type": "bearer"
    }
    ```
*   **Error Response (401 Unauthorized):** If email or password is incorrect.
    ```json
    { "detail": "Incorrect email or password" }
    ```

### 3. Refresh Access Token

*   **Endpoint:** `POST /auth/refresh-token`
*   **Summary:** Generates a new access token using a valid refresh token.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "refresh_token": "your_valid_refresh_token"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "access_token": "new_access_token",
      "refresh_token": "your_valid_refresh_token", // Refresh token is returned unchanged
      "token_type": "bearer"
    }
    ```
*   **Error Response (401 Unauthorized):** If the refresh token is invalid or expired.
    ```json
    { "detail": "Refresh token is invalid or expired" }
    ```

### 4. User Logout

*   **Endpoint:** `POST /auth/logout`
*   **Summary:** Logs out the current user by blacklisting their current access token.
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):**
    ```json
    { "message": "Successfully logged out" }
    ```
*   **Error Response (401 Unauthorized):** If the token is invalid or already revoked.

### 5. Revoke Token

*   **Endpoint:** `POST /auth/revoke-token`
*   **Summary:** Explicitly revokes (blacklists) the provided access token. Useful for security events.
*   **Authentication:** Bearer Token required (the token to be revoked).
*   **Success Response (200 OK):**
    ```json
    { "message": "Token has been revoked" }
    ```
*   **Error Response (401 Unauthorized):** If the token is invalid.

### 6. Validate Token

*   **Endpoint:** `POST /auth/validate-token`
*   **Summary:** Validates the provided Bearer token. Checks signature, expiry, and blacklist status.
*   **Authentication:** Bearer Token required (the token to be validated).
*   **Success Response (200 OK):**
    ```json
    {
      "valid": true,
      "user_id": "uuid",
      "username": "string",
      "email": "user@example.com"
    }
    ```
*   **Error Response (401 Unauthorized):** If the token is invalid, expired, or blacklisted.
    ```json
    { "detail": "Invalid authentication credentials" } // Or specific reason
    ```

---

## 📧 Email Verification Endpoints

### 7. Initiate Email Verification

*   **Endpoint:** `POST /auth/verify-email/initiate`
*   **Summary:** Generates an email verification token for the authenticated user. (In production, this token should be sent via email).
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Verification email sent",
      "verification_token": "string" // For testing/dev; normally sent via email
    }
    ```

### 8. Verify Email Address

*   **Endpoint:** `GET /auth/verify-email`
*   **Summary:** Verifies a user's email address using the token from the initiation step.
*   **Authentication:** None required (token contains user info).
*   **Query Parameter:** `token=<verification_token>`
*   **Success Response (200 OK):**
    ```json
    { "message": "Email successfully verified" }
    ```
*   **Error Response (400 Bad Request):** If the token is invalid or expired.
    ```json
    { "detail": "Invalid token" }
    ```
*   **Error Response (404 Not Found):** If the user associated with the token is not found.
    ```json
    { "detail": "User not found" }
    ```

---

## 🔑 Password Management Endpoints

### 9. Forgot Password

*   **Endpoint:** `POST /auth/forgot-password`
*   **Summary:** Initiates the password reset process. Generates a password reset token. (In production, this token should be sent via email).
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    { "email": "user@example.com" }
    ```
*   **Success Response (200 OK):** (Always returns the same message to prevent email harvesting)
    ```json
    {
      "message": "If your email exists in the system, a password reset link was sent.",
      // "reset_token": "string" // Only included if user exists, for testing/dev
    }
    ```

### 10. Reset Password

*   **Endpoint:** `POST /auth/reset-password`
*   **Summary:** Resets the user's password using a valid reset token.
*   **Authentication:** None required (token contains user info).
*   **Request Body:**
    ```json
    {
      "token": "your_reset_token",
      "new_password": "your_new_secure_password"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    { "message": "Password has been reset successfully" }
    ```
*   **Error Response (400 Bad Request):** If the token is invalid or expired.
    ```json
    { "detail": "Invalid or expired token" }
    ```
*   **Error Response (404 Not Found):** If the user associated with the token is not found.
    ```json
    { "detail": "User not found" }
    ```

### 11. Change Password

*   **Endpoint:** `POST /auth/change-password`
*   **Summary:** Allows an authenticated user to change their current password.
*   **Authentication:** Bearer Token required.
*   **Request Body:**
    ```json
    {
      "old_password": "current_password",
      "new_password": "new_secure_password"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    { "message": "Password has been changed successfully" }
    ```
*   **Error Response (400 Bad Request):** If the old password is incorrect.
    ```json
    { "detail": "Old password is incorrect" }
    ```
*   **Error Response (404 Not Found):** If the authenticated user is not found (should not typically happen).

---

## 🧑‍💻 User Profile Endpoints

### 12. Get User Profile

*   **Endpoint:** `GET /auth/profile`
*   **Summary:** Retrieves the profile information of the currently authenticated user.
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):** (Full user profile including exam time fields)
    ```json
    {
      "id": "uuid",
      "username": "string",
      "email": "user@example.com",
      "full_name": "User Full Name",
      "is_active": true,
      "age": null,
      "gender": null,
      "russian_level": null,
      "gemini_api_key": null,
      "time_start": "datetime | null",
      "duration": "integer | null",
      "time_end": "datetime | null"
      // email_verified field might also be present
    }
    ```

### 13. Update User Profile

*   **Endpoint:** `PUT /auth/profile`
*   **Summary:** Updates the profile information (excluding email and password) of the currently authenticated user. Only include fields to be updated.
*   **Authentication:** Bearer Token required.
*   **Request Body:**
    ```json
    {
      "username": "new_username (optional)",
      "full_name": "Updated Full Name (optional)",
      "age": 30 (optional),
      "gender": "Male/Female/Other (optional)",
      "russian_level": "A1/A2/B1/B2/C1/C2 (optional)",
      "gemini_api_key": "your_api_key (optional)"
    }
    ```
*   **Success Response (200 OK):** The updated user profile (Structure matches `GET /auth/profile` response).
*   **Error Response (400 Bad Request):** If the requested username is already taken.
    ```json
    { "detail": "Username already taken" }
    ```
*   **Error Response (404 Not Found):** If the user is not found.

### 14. Update User Email

*   **Endpoint:** `PUT /auth/profile/email`
*   **Summary:** Updates the email address of the authenticated user. This will reset the email verification status (`email_verified` becomes `false`).
*   **Authentication:** Bearer Token required.
*   **Request Body:**
    ```json
    { "email": "new_email@example.com" }
    ```
*   **Success Response (200 OK):** The updated user profile with the new email and `email_verified` set to `false`.
*   **Error Response (400 Bad Request):** If the new email is already in use by another account.
    ```json
    { "detail": "Email already registered" }
    ```
*   **Error Response (404 Not Found):** If the user is not found.

### 15. Deactivate User Account

*   **Endpoint:** `DELETE /auth/profile`
*   **Summary:** Deactivates the account of the currently authenticated user (sets `is_active` to `false`). The user can potentially be reactivated later.
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):**
    ```json
    { "message": "Account deactivated successfully" }
    ```
*   **Error Response (404 Not Found):** If the user is not found.

### 16. Permanently Delete User Account

*   **Endpoint:** `DELETE /auth/profile/permanent`
*   **Summary:** Permanently deletes the account of the currently authenticated user from the database. **This action is irreversible.**
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):**
    ```json
    { "message": "Account permanently deleted successfully" }
    ```
*   **Error Response (404 Not Found):** If the user is not found.

---

## ⏱️ Exam Time Management Endpoints

These endpoints manage the start, end, and status of timed exams associated with a user.

### 17. Start Exam Timer

*   **Endpoint:** `POST /exam-time/start`
*   **Summary:** Starts or resumes an exam timer for the current user. If an active timer exists, it returns the current status. Otherwise, it starts a new timer.
*   **Authentication:** Bearer Token required.
*   **Request Body:**
    ```json
    {
      "duration": 3600 // Optional: Duration in seconds (default: 3600 = 60 minutes)
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "time_start": "datetime", // Time the exam started (UTC)
      "duration": integer,      // Total duration in seconds
      "time_end": "datetime",   // Calculated end time (UTC)
      "remaining_seconds": integer, // Seconds remaining
      "is_active": true         // Indicates the timer is running
    }
    ```

### 18. Get Exam Timer Status

*   **Endpoint:** `GET /exam-time/status`
*   **Summary:** Retrieves the current status of the exam timer for the authenticated user.
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):**
    ```json
    {
      "time_start": "datetime | null",
      "duration": integer | null,
      "time_end": "datetime | null",
      "remaining_seconds": integer, // 0 if not active or finished
      "is_active": boolean        // True if timer is currently running
    }
    ```

### 19. End Exam Timer

*   **Endpoint:** `POST /exam-time/end`
*   **Summary:** Manually ends the current exam timer for the authenticated user. If the timer was already finished, it returns the finished state.
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):** Returns the final state of the timer.
    ```json
    {
      "time_start": "datetime",
      "duration": integer,
      "time_end": "datetime", // The time it was ended (either calculated or current time if ended early)
      "remaining_seconds": 0,
      "is_active": false
    }
    ```
*   **Error Response (400 Bad Request):** If no exam is currently in progress.
    ```json
    { "detail": "Không có bài thi đang diễn ra" } // Note: Error message seems to be in Vietnamese
    ```

### 20. Reset Exam Timer

*   **Endpoint:** `POST /exam-time/reset`
*   **Summary:** Resets the exam timer fields (`time_start`, `time_end`) for the authenticated user, effectively clearing any active or completed exam session state. Duration might be kept or reset based on implementation.
*   **Authentication:** Bearer Token required.
*   **Success Response (200 OK):** Returns the reset state.
    ```json
    {
      "time_start": null,
      "duration": integer | null, // May retain previous duration or be reset
      "time_end": null,
      "remaining_seconds": 0,
      "is_active": false
    }