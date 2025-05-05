# Tài liệu API Dịch vụ AI RumAI 🤖

Tài liệu này cung cấp chi tiết về các điểm cuối API (API endpoints) có sẵn cho Dịch vụ AI của RumAI, bao gồm khả năng tạo văn bản và xử lý hình ảnh.

## URL Cơ sở

URL cơ sở cho API Dịch vụ AI là: `https://api.rumai.app`

## Xác thực

Hầu hết các điểm cuối yêu cầu xác thực bằng cách sử dụng **Bearer Token** được cung cấp trong header `Authorization`:

```
Authorization: Bearer <your_access_token>
```

Lấy token này thông qua điểm cuối `POST /auth/login` của Dịch vụ Xác thực.

---

## 🤖 Điểm cuối Dịch vụ AI

### 1. Kiểm tra Trạng thái

*   **Điểm cuối:** `GET /v1/health`
*   **Tóm tắt:** Kiểm tra trạng thái hoạt động của dịch vụ AI.
*   **Xác thực:** Không yêu cầu.
*   **Phản hồi Thành công (200 OK):**
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

### 2. Tạo Văn bản

*   **Điểm cuối:** `POST /v1/chat/generate-text`
*   **Tóm tắt:** Tạo phản hồi văn bản sử dụng các mô hình Gemini.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Headers:**
    - `X-Google-API-Key`: YOUR_KEY (tùy chọn) - Nếu không cung cấp, dịch vụ sẽ sử dụng API key được chỉ định trong cấu hình.
*   **Nội dung Yêu cầu:**
    ```json
    {
      "message": "Lợi ích của AI trong lĩnh vực y tế là gì?",
      "history": [
        {
          "role": "user",
          "content": "Hãy cho tôi biết về trí tuệ nhân tạo."
        },
        {
          "role": "assistant",
          "content": "Trí tuệ nhân tạo (AI) đề cập đến các hệ thống được thiết kế để thực hiện các nhiệm vụ thường đòi hỏi trí thông minh của con người..."
        }
      ],
      "model": "gemini-2.5-pro-exp-03-25"
    }
    ```
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "response_text": "AI mang lại nhiều lợi ích cho ngành y tế, bao gồm cải thiện độ chính xác trong chẩn đoán thông qua phân tích hình ảnh y tế, đề xuất điều trị cá nhân hóa dựa trên dữ liệu bệnh nhân, hợp lý hóa các quy trình hành chính, phân tích dự đoán về dịch bệnh, và khả năng theo dõi bệnh nhân từ xa...",
      "model_used": "gemini-2.5-pro-exp-03-25"
    }
    ```
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu xác thực thất bại.
*   **Phản hồi Lỗi (400 Bad Request):** Nếu tham số không hợp lệ.

### 3. Trích xuất Văn bản từ Hình ảnh

*   **Điểm cuối:** `POST /v1/vision/extract-text`
*   **Tóm tắt:** Trích xuất văn bản từ hình ảnh sử dụng các mô hình Gemini Vision.
*   **Xác thực:** Yêu cầu Bearer Token.
*   **Headers:**
    - `X-Google-API-Key`: YOUR_KEY (tùy chọn)
*   **Dữ liệu Form:**
    - `file` (file, bắt buộc): Tệp hình ảnh để trích xuất văn bản
    - `prompt` (string, tùy chọn): Prompt tùy chỉnh để hướng dẫn việc trích xuất
    - `model` (string, tùy chọn): Mô hình vision được sử dụng (mặc định là "gemini-2.0-flash")
*   **Phản hồi Thành công (200 OK):**
    ```json
    {
      "filename": "document.jpg",
      "content_type": "image/jpeg",
      "extracted_text": "Chương trình Họp\n1. Cập nhật Dự án\n2. Đánh giá Ngân sách\n3. Thảo luận Tiến độ\n4. Sáng kiến Mới\n5. Hỏi & Đáp",
      "model_used": "gemini-2.0-flash"
    }
    ```
*   **Phản hồi Lỗi (400 Bad Request):** Nếu định dạng tệp không hợp lệ hoặc tệp quá lớn.
*   **Phản hồi Lỗi (401 Unauthorized):** Nếu xác thực thất bại.