---
description: >-
  This document provides a structured guide. It includes endpoints for user
  registration, login, token management, profile updates, and account deletion,
  with example requests and responses.
---

# Authentication Service API Documentation

### Base URL

```
http://api.rumai.app
```

***

### 1. User Registration

#### Endpoint:

```
POST /auth/register
```

#### Request Body (JSON):

```json
{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Response (Success 201):

```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "exampleuser",
    "email": "user@example.com",
    "is_active": true
  }
}
```

***

### 2. User Login

#### Endpoint:

```
POST /auth/login
```

#### Request Body (JSON):

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Response (Success 200):

```json
{
  "access_token": "eyJhbGciOiJIUz...",
  "refresh_token": "eyJhbGciOiJIUz...",
  "token_type": "bearer"
}
```

***

### 3. Refresh Access Token

#### Endpoint:

```
POST /auth/refresh-token
```

#### Request Body (JSON):

```json
{
  "refresh_token": "eyJhbGciOiJIUz..."
}
```

#### Response (Success 200):

```json
{
  "access_token": "new_access_token",
  "refresh_token": "same_refresh_token",
  "token_type": "bearer"
}
```

***

### 4. Logout

#### Endpoint:

```
POST /auth/logout
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Response (Success 200):

```json
{
  "message": "Successfully logged out"
}
```

***

### 5. Verify Email

#### Initiate Email Verification

**Endpoint:**

```
POST /auth/verify-email/initiate
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Response (Success 200):

```json
{
  "message": "Verification email sent",
  "verification_token": "verification_token_here"
}
```

#### Verify Email

**Endpoint:**

```
GET /auth/verify-email?token={verification_token}
```

#### Response (Success 200):

```json
{
  "message": "Email successfully verified"
}
```

***

### 6. Forgot Password

#### Endpoint:

```
POST /auth/forgot-password
```

#### Request Body (JSON):

```json
{
  "email": "user@example.com"
}
```

#### Response (Success 200):

```json
{
  "message": "If your email exists in the system, a password reset link was sent.",
  "reset_token": "reset_token_here"
}
```

***

### 7. Reset Password

#### Endpoint:

```
POST /auth/reset-password
```

#### Request Body (JSON):

```json
{
  "token": "reset_token_here",
  "new_password": "new_securepassword"
}
```

#### Response (Success 200):

```json
{
  "message": "Password has been reset successfully"
}
```

***

### 8. Change Password

#### Endpoint:

```
POST /auth/change-password
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Request Body (JSON):

```json
{
  "old_password": "oldpassword",
  "new_password": "newsecurepassword"
}
```

#### Response (Success 200):

```json
{
  "message": "Password has been changed successfully"
}
```

***

### 9. Get User Profile

#### Endpoint:

```
GET /auth/profile
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Response (Success 200):

```json
{
  "id": 1,
  "username": "exampleuser",
  "email": "user@example.com",
  "is_active": true
}
```

***

### 10. Update User Profile

#### Endpoint:

```
PUT /auth/profile
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Request Body (JSON):

```json
{
  "username": "newusername"
}
```

#### Response (Success 200):

```json
{
  "id": 1,
  "username": "newusername",
  "email": "user@example.com",
  "is_active": true
}
```

***

### 11. Deactivate Account

#### Endpoint:

```
DELETE /auth/profile
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Response (Success 200):

```json
{
  "message": "User account has been deactivated"
}
```

***

### 12. Permanently Delete Account

#### Endpoint:

```
DELETE /auth/profile/permanent
```

#### Headers:

```
Authorization: Bearer {access_token}
```

#### Response (Success 200):

```json
{
  "message": "User account has been permanently deleted"
}
```

***

### 13. Validate Token

**Endpoint:**

```
POST /auth/validate-token
```

**Summary:**\
This endpoint validates the provided JWT token and returns basic user information if the token is valid.

**Description:**

* The token is supplied via the `Authorization` header as a Bearer token.
* The endpoint checks if the token is blacklisted (i.e., revoked) and then decodes it.
* It verifies the token payload and confirms that the associated user exists in the database.
* If the token is valid, it returns basic user information; otherwise, it raises an appropriate error.

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (Success 200):**

```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "exampleuser"
  }
}
```

**Error Responses:**

* **401 Unauthorized:**
  * When the token has been revoked or is invalid/expired (e.g., "Token has been revoked" or "Invalid token payload").
* **404 Not Found:**
  * When the user associated with the token does not exist.
* **500 Internal Server Error:**
  * For any unexpected errors.

***

### Notes

* All secured endpoints require the `Authorization: Bearer {access_token}` header.
* Ensure refresh tokens are stored securely and used only for refreshing access tokens.
* For email verification and password reset, the tokens should be handled securely and validated before submission.
