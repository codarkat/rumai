---
description: Tài liệu hướng dẫn sử dụng API Quản lý thời gian thi
---

# Exam Time API Doc

**BASE URL:** `https://api.rumai.app`

***

### 1. Giới thiệu

API Quản lý thời gian thi cung cấp các endpoint để quản lý thời gian làm bài thi của người dùng. Hệ thống này cho phép:

* Bắt đầu thời gian làm bài thi
* Kiểm tra trạng thái và thời gian còn lại
* Kết thúc bài thi
* Đặt lại thời gian thi

***

### 2. Xác thực

Tất cả các API endpoints đều yêu cầu xác thực bằng JWT token. Token phải được gửi trong header Authorization với định dạng:

```http
Authorization: Bearer {token}
```

Ví dụ:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

***

### 3. Endpoints

#### 3.1. Bắt đầu bài thi

* **Endpoint**: `POST /exam-time/start`
* **Mô tả**: Bắt đầu thời gian làm bài thi cho người dùng hiện tại.
* **Request Body**:

```json
{
  "duration": 3600  // Thời gian làm bài tính bằng giây (tùy chọn, mặc định 3600 giây = 60 phút)
}
```

* **Response (200 OK)**:

```json
{
  "time_start": "2023-07-10T10:00:00Z",
  "duration": 3600,
  "time_end": "2023-07-10T11:00:00Z",
  "remaining_seconds": 3600,
  "is_active": true
}
```

* **Trường hợp đặc biệt**: Nếu đã có bài thi đang diễn ra:

```json
{
  "time_start": "2023-07-10T10:00:00Z",
  "duration": 3600,
  "time_end": "2023-07-10T11:00:00Z",
  "remaining_seconds": 1800,  // Còn 30 phút
  "is_active": true
}
```

#### 3.2. Kiểm tra trạng thái bài thi

* **Endpoint**: `GET /exam-time/status`
* **Mô tả**: Lấy thông tin trạng thái thời gian bài thi.
* **Response (200 OK)**:

```json
{
  "time_start": "2023-07-10T10:00:00Z",
  "duration": 3600,
  "time_end": "2023-07-10T11:00:00Z",
  "remaining_seconds": 2400,  // Còn 40 phút
  "is_active": true
}
```

* **Trường hợp không có bài thi đang diễn ra**:

```json
{
  "time_start": null,
  "duration": 3600,  // Mặc định 60 phút
  "time_end": null,
  "remaining_seconds": 0,
  "is_active": false
}
```

* **Trường hợp bài thi đã kết thúc**:

```json
{
  "time_start": "2023-07-10T10:00:00Z",
  "duration": 3600,
  "time_end": "2023-07-10T11:00:00Z",
  "remaining_seconds": 0,  // Hết giờ
  "is_active": false
}
```

#### 3.3. Kết thúc bài thi

* **Endpoint**: `POST /exam-time/end`
* **Mô tả**: Kết thúc bài thi của người dùng hiện tại.
* **Response (200 OK)**:

```json
{
  "time_start": "2023-07-10T10:00:00Z",
  "duration": 3600,
  "time_end": "2023-07-10T10:45:00Z",  // Kết thúc sớm
  "remaining_seconds": 0,
  "is_active": false
}
```

* **Trường hợp không có bài thi đang diễn ra**:

```json
{
  "detail": "Không có bài thi đang diễn ra"
}
```

* **Status code**: `400 Bad Request`

#### 3.4. Đặt lại thời gian thi

* **Endpoint**: `POST /exam-time/reset`
* **Mô tả**: Đặt lại thời gian bài thi của người dùng hiện tại.
* **Response (200 OK)**:

```json
{
  "time_start": null,
  "duration": 3600,  // Giữ nguyên giá trị duration
  "time_end": null,
  "remaining_seconds": 0,
  "is_active": false
}
```

***

### 4. Các trường hợp sử dụng

#### 4.1. Luồng bình thường

* Người dùng đăng nhập và nhận token
* Gọi `POST /exam-time/start` để bắt đầu bài thi
* Hiển thị bộ đếm thời gian, đồng bộ theo `remaining_seconds`
* Gọi định kỳ `GET /exam-time/status`
* Kết thúc bài thi với `POST /exam-time/end`

#### 4.2. Người dùng thoát ra và quay lại

* Sau khi bắt đầu bài thi, nếu người dùng thoát ra:
* Gọi lại `GET /exam-time/status`
* Nếu `is_active = true`: tiếp tục bài thi
* Nếu `is_active = false`: hiển thị thông báo hết thời gian

#### 4.3. Đặt lại bài thi

* Dành cho admin hoặc người dùng cần làm lại bài thi
* Gọi `POST /exam-time/reset`, sau đó gọi lại `POST /exam-time/start`

***

### 5. Xử lý lỗi

#### 5.1. Lỗi xác thực

* **Status**: 401 Unauthorized

```json
{
  "detail": "Invalid authentication credentials"
}
```

#### 5.2. Không tìm thấy người dùng

* **Status**: 404 Not Found

```json
{
  "detail": "User not found"
}
```

#### 5.3. Không có bài thi đang diễn ra

* **Status**: 400 Bad Request

```json
{
  "detail": "Không có bài thi đang diễn ra"
}
```

***

### 6. Lưu ý quan trọng

* **Múi giờ**: Tất cả thời gian trả về theo UTC (ISO 8601). Frontend cần tự chuyển sang múi giờ người dùng.
* **Đồng bộ thời gian**: Nên gọi `GET /exam-time/status` định kỳ để đồng bộ và tránh gian lận.
* **Xử lý mất kết nối**: Vẫn tiếp tục đếm ngược theo thời gian đã biết, đồng bộ lại khi có mạng.
* **Bảo mật token**: Luôn dùng HTTPS và lưu token an toàn phía client.
