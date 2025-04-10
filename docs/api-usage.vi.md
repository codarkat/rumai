# Tài liệu API RumAI - Dịch vụ Xác thực 🔑

Tài liệu này cung cấp chi tiết về các điểm cuối API (API endpoints) có sẵn cho Dịch vụ Xác thực của RumAI, bao gồm quản lý người dùng, luồng xác thực và theo dõi thời gian làm bài thi.

## URL Cơ sở

URL cơ sở cho API Dịch vụ Xác thực là: `https://api.rumai.app`

## Xác thực

Hầu hết các điểm cuối yêu cầu xác thực bằng cách sử dụng **Bearer Token** được cung cấp trong header `Authorization`:

```
Authorization: Bearer <your_access_token>
```

Lấy token này thông qua điểm cuối `POST /auth/login`.

---

## 👤 Điểm cuối Người dùng & Xác thực

### 1. Đăng ký Người dùng

*   **Điểm cuối:** `POST /auth/register`
*   **Tóm tắt:** Đăng ký một tài khoản người dùng mới.
*   **Xác thực:** Không yêu cầu.
*   **Nội dung Yêu cầu (Request Body):**
    ```json
    {
      "username": "string (tùy chọn)",
      "email": "user@example.com",
      "password": "yourpassword",
      "full_name": "Tên Đầy Đủ Người Dùng",
      "gemini_api_key": "your_gemini_api_key (tùy chọn)"
    }
    ```
*   **Phản hồi Thành công (201 Created):**
    ```json
    {
      "message": "Đăng ký thành công",
      "user": {
        "id": "uuid",
        "username": "string",
        "email": "user@example.com",
        "full_name": "Tên Đầy Đủ Người Dùng",
        "is_active": true,
        // Các trường hồ sơ khác được khởi tạo là null/mặc định
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
*   **Phản hồi Lỗi (400 Bad Request):** Nếu email hoặc tên người dùng đã tồn tại.
    ```json
    { "detail": "Đăng ký thất bại. Email hoặc tên người dùng đã tồn tại." }
    ```

### 2. Đăng nhập Người dùng

*   **Điểm cuối:** `POST /auth/login`
*   **Tóm tắt:** Xác thực người dùng và trả về access token và refresh token.
*   **Xác thực:** Không yêu cầu.
*   **Nội dung Yêu cầu:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "access_token": "string",
      "refresh_token": "string",
      "token_type": "bearer"
    }
    ```
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu email hoặc mật khẩu không chính xác.
    ```json
    { "detail": "Email hoặc mật khẩu không chính xác" }
    ```

### 3. Làm mới Access Token

*   **Điểm cuối:** `POST /auth/refresh-token`
*   **Tóm tắt:** Tạo một access token mới bằng cách sử dụng refresh token hợp lệ.
*   **Xác thực:** Không yêu cầu.
*   **Nội dung Yêu cầu:**
    ```json
    {
      "refresh_token": "your_valid_refresh_token"
    }
    ```
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "access_token": "new_access_token",
      "refresh_token": "your_valid_refresh_token", // Refresh token được trả về không đổi
      "token_type": "bearer"
    }
    ```
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu refresh token không hợp lệ hoặc đã hết hạn.
    ```json
    { "detail": "Refresh token không hợp lệ hoặc đã hết hạn" }
    ```

### 4. Đăng xuất Người dùng

*   **Điểm cuối:** `POST /auth/logout`
*   **Tóm tắt:** Đăng xuất người dùng hiện tại bằng cách đưa access token hiện tại của họ vào danh sách đen.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Đăng xuất thành công" }
    ```
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu token không hợp lệ hoặc đã bị thu hồi.

### 5. Thu hồi Token

*   **Điểm cuối:** `POST /auth/revoke-token`
*   **Tóm tắt:** Thu hồi (đưa vào danh sách đen) access token được cung cấp một cách rõ ràng. Hữu ích cho các sự kiện bảo mật.
*   **Xác thực:** Yêu cầu Bearer Token (token cần thu hồi).
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Token đã được thu hồi" }
    ```
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu token không hợp lệ.

### 6. Xác thực Token

*   **Điểm cuối:** `POST /auth/validate-token`
*   **Tóm tắt:** Xác thực Bearer token được cung cấp. Kiểm tra chữ ký, thời hạn và trạng thái danh sách đen.
*   **Xác thực:** Yêu cầu Bearer Token (token cần xác thực).
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "valid": true,
      "user_id": "uuid",
      "username": "string",
      "email": "user@example.com"
    }
    ```
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu token không hợp lệ, đã hết hạn hoặc nằm trong danh sách đen.
    ```json
    { "detail": "Thông tin xác thực không hợp lệ" } // Hoặc lý do cụ thể
    ```

---

## 📧 Điểm cuối Xác minh Email

### 7. Bắt đầu Xác minh Email

*   **Điểm cuối:** `POST /auth/verify-email/initiate`
*   **Tóm tắt:** Tạo token xác minh email cho người dùng đã xác thực. (Trong môi trường production, token này nên được gửi qua email).
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "message": "Email xác minh đã được gửi",
      "verification_token": "string" // Dùng cho testing/dev; thông thường được gửi qua email
    }
    ```

### 8. Xác minh Địa chỉ Email

*   **Điểm cuối:** `GET /auth/verify-email`
*   **Tóm tắt:** Xác minh địa chỉ email của người dùng bằng token từ bước bắt đầu.
*   **Xác thực:** Không yêu cầu (token chứa thông tin người dùng).
*   **Tham số Truy vấn (Query Parameter):** `token=<verification_token>`
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Email đã được xác minh thành công" }
    ```
*   **Phản hồi Lỗi (400 Bad Request):** Nếu token không hợp lệ hoặc đã hết hạn.
    ```json
    { "detail": "Token không hợp lệ" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng liên kết với token.
    ```json
    { "detail": "Không tìm thấy người dùng" }
    ```

---

## 🔑 Điểm cuối Quản lý Mật khẩu

### 9. Quên Mật khẩu

*   **Điểm cuối:** `POST /auth/forgot-password`
*   **Tóm tắt:** Bắt đầu quy trình đặt lại mật khẩu. Tạo token đặt lại mật khẩu. (Trong môi trường production, token này nên được gửi qua email).
*   **Xác thực:** Không yêu cầu.
*   **Nội dung Yêu cầu:**
    ```json
    { "email": "user@example.com" }
    ```
*   **Phản hồi Thành công (200 OK):** (Luôn trả về cùng một thông báo để tránh thu thập email)
    ```json
    {
      "message": "Nếu email của bạn tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi.",
      // "reset_token": "string" // Chỉ bao gồm nếu người dùng tồn tại, dùng cho testing/dev
    }
    ```

### 10. Đặt lại Mật khẩu

*   **Điểm cuối:** `POST /auth/reset-password`
*   **Tóm tắt:** Đặt lại mật khẩu của người dùng bằng cách sử dụng token đặt lại hợp lệ.
*   **Xác thực:** Không yêu cầu (token chứa thông tin người dùng).
*   **Nội dung Yêu cầu:**
    ```json
    {
      "token": "your_reset_token",
      "new_password": "your_new_secure_password"
    }
    ```
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Mật khẩu đã được đặt lại thành công" }
    ```
*   **Phản hồi Lỗi (400 Bad Request):** Nếu token không hợp lệ hoặc đã hết hạn.
    ```json
    { "detail": "Token không hợp lệ hoặc đã hết hạn" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng liên kết với token.
    ```json
    { "detail": "Không tìm thấy người dùng" }
    ```

### 11. Thay đổi Mật khẩu

*   **Điểm cuối:** `POST /auth/change-password`
*   **Tóm tắt:** Cho phép người dùng đã xác thực thay đổi mật khẩu hiện tại của họ.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Nội dung Yêu cầu:**
    ```json
    {
      "old_password": "current_password",
      "new_password": "new_secure_password"
    }
    ```
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Mật khẩu đã được thay đổi thành công" }
    ```
*   **Phản hồi Lỗi (400 Bad Request):** Nếu mật khẩu cũ không chính xác.
    ```json
    { "detail": "Mật khẩu cũ không chính xác" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng đã xác thực (thường không xảy ra).

---

## 🧑‍💻 Điểm cuối Hồ sơ Người dùng

### 12. Lấy Hồ sơ Người dùng

*   **Điểm cuối:** `GET /auth/profile`
*   **Tóm tắt:** Lấy thông tin hồ sơ của người dùng hiện đang được xác thực.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):** (Hồ sơ người dùng đầy đủ bao gồm các trường thời gian thi)
    ```json
    {
      "id": "uuid",
      "username": "string",
      "email": "user@example.com",
      "full_name": "Tên Đầy Đủ Người Dùng",
      "is_active": true,
      "age": null,
      "gender": null,
      "russian_level": null,
      "gemini_api_key": null,
      "time_start": "datetime | null",
      "duration": "integer | null",
      "time_end": "datetime | null"
      // Trường email_verified cũng có thể có mặt
    }
    ```

### 13. Cập nhật Hồ sơ Người dùng

*   **Điểm cuối:** `PUT /auth/profile`
*   **Tóm tắt:** Cập nhật thông tin hồ sơ (không bao gồm email và mật khẩu) của người dùng hiện đang được xác thực. Chỉ bao gồm các trường cần cập nhật.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Nội dung Yêu cầu:**
    ```json
    {
      "username": "new_username (tùy chọn)",
      "full_name": "Tên Đầy Đủ Đã Cập Nhật (tùy chọn)",
      "age": 30 (tùy chọn),
      "gender": "Nam/Nữ/Khác (tùy chọn)",
      "russian_level": "A1/A2/B1/B2/C1/C2 (tùy chọn)",
      "gemini_api_key": "your_api_key (tùy chọn)"
    }
    ```
*   **Phản hồi Thành công (200 OK):** Hồ sơ người dùng đã cập nhật (Cấu trúc khớp với phản hồi `GET /auth/profile`).
*   **Phản hồi Lỗi (400 Bad Request):** Nếu tên người dùng yêu cầu đã được sử dụng.
    ```json
    { "detail": "Tên người dùng đã được sử dụng" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng.

### 14. Cập nhật Email Người dùng

*   **Điểm cuối:** `PUT /auth/profile/email`
*   **Tóm tắt:** Cập nhật địa chỉ email của người dùng đã xác thực. Hành động này sẽ đặt lại trạng thái xác minh email (`email_verified` trở thành `false`).
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Nội dung Yêu cầu:**
    ```json
    { "email": "new_email@example.com" }
    ```
*   **Phản hồi Thành công (200 OK):** Hồ sơ người dùng đã cập nhật với email mới và `email_verified` được đặt thành `false`.
*   **Phản hồi Lỗi (400 Bad Request):** Nếu email mới đã được sử dụng bởi tài khoản khác.
    ```json
    { "detail": "Email đã được đăng ký" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng.

### 15. Hủy kích hoạt Tài khoản Người dùng

*   **Điểm cuối:** `DELETE /auth/profile`
*   **Tóm tắt:** Hủy kích hoạt tài khoản của người dùng hiện đang được xác thực (đặt `is_active` thành `false`). Người dùng có thể được kích hoạt lại sau này.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Tài khoản đã được hủy kích hoạt thành công" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng.

### 16. Xóa vĩnh viễn Tài khoản Người dùng

*   **Điểm cuối:** `DELETE /auth/profile/permanent`
*   **Tóm tắt:** Xóa vĩnh viễn tài khoản của người dùng hiện đang được xác thực khỏi cơ sở dữ liệu. **Hành động này không thể hoàn tác.**
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):**
    ```json
    { "message": "Tài khoản đã được xóa vĩnh viễn thành công" }
    ```
*   **Phản hồi Lỗi (404 Not Found):** Nếu không tìm thấy người dùng.

---

## ⏱️ Điểm cuối Quản lý Thời gian Thi

Các điểm cuối này quản lý việc bắt đầu, kết thúc và trạng thái của các bài thi có giới hạn thời gian liên kết với người dùng.

### 17. Bắt đầu Đồng hồ Thi

*   **Điểm cuối:** `POST /exam-time/start`
*   **Tóm tắt:** Bắt đầu hoặc tiếp tục đồng hồ thi cho người dùng hiện tại. Nếu có đồng hồ đang hoạt động, nó sẽ trả về trạng thái hiện tại. Nếu không, nó sẽ bắt đầu một đồng hồ mới.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Nội dung Yêu cầu:**
    ```json
    {
      "duration": 3600 // Tùy chọn: Thời lượng tính bằng giây (mặc định: 3600 = 60 phút)
    }
    ```
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "time_start": "datetime", // Thời gian bắt đầu thi (UTC)
      "duration": integer,      // Tổng thời lượng tính bằng giây
      "time_end": "datetime",   // Thời gian kết thúc dự kiến (UTC)
      "remaining_seconds": integer, // Số giây còn lại
      "is_active": true         // Cho biết đồng hồ đang chạy
    }
    ```

### 18. Lấy Trạng thái Đồng hồ Thi

*   **Điểm cuối:** `GET /exam-time/status`
*   **Tóm tắt:** Lấy trạng thái hiện tại của đồng hồ thi cho người dùng đã xác thực.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "time_start": "datetime | null",
      "duration": integer | null,
      "time_end": "datetime | null",
      "remaining_seconds": integer, // 0 nếu không hoạt động hoặc đã kết thúc
      "is_active": boolean        // True nếu đồng hồ đang chạy
    }
    ```

### 19. Kết thúc Đồng hồ Thi

*   **Điểm cuối:** `POST /exam-time/end`
*   **Tóm tắt:** Kết thúc thủ công đồng hồ thi hiện tại cho người dùng đã xác thực. Nếu đồng hồ đã kết thúc, nó sẽ trả về trạng thái đã kết thúc.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):** Trả về trạng thái cuối cùng của đồng hồ.
    ```json
    {
      "time_start": "datetime",
      "duration": integer,
      "time_end": "datetime", // Thời gian kết thúc (dự kiến hoặc hiện tại nếu kết thúc sớm)
      "remaining_seconds": 0,
      "is_active": false
    }
    ```
*   **Phản hồi Lỗi (400 Bad Request):** Nếu không có bài thi nào đang diễn ra.
    ```json
    { "detail": "Không có bài thi đang diễn ra" }
    ```

### 20. Đặt lại Đồng hồ Thi

*   **Điểm cuối:** `POST /exam-time/reset`
*   **Tóm tắt:** Đặt lại các trường đồng hồ thi (`time_start`, `time_end`) cho người dùng đã xác thực, xóa trạng thái phiên thi đang hoạt động hoặc đã hoàn thành. Thời lượng có thể được giữ lại hoặc đặt lại tùy thuộc vào cách triển khai.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Phản hồi Thành công (200 OK):** Trả về trạng thái đã đặt lại.
    ```json
    {
      "time_start": null,
      "duration": integer | null, // Có thể giữ lại thời lượng trước đó hoặc được đặt lại
      "time_end": null,
      "remaining_seconds": 0,
      "is_active": false
    }