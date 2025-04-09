---
hidden: true
---

# API Gateway Kong RumAI

## API Gateway: Kong

<pre><code>http://31.130.144.216:7337/
<strong>https://konga.rumai.app/
</strong></code></pre>

* **uname:** xuancanhit
* **email:** xuancanhit99@gmail.com
* **pass:** Canh1412

### Connection

* **Name:** Kong RumAI
* **Kong Admin URL:** http://kong:8001

### Add Service

1. Tạo Service trong Kong:

```
curl -i -X POST http://localhost:7001/services \
  --data "name=auth-service" \
  --data "url=http://auth:8800"
```

2. Tạo Route cho Service:

```
curl -i -X POST http://localhost:7001/services/auth-service/routes \
  --data "paths[]=/auth" \
  --data "name=auth-route" \
  --data "strip_path=true"
```

3. Kiểm tra kết nối:

```
# Kiểm tra trực tiếp
curl http://localhost:8800/health

# Kiểm tra thông qua Kong
curl http://localhost:7000/auth/health
```

#### 🚀 **Cấu Hình Authentication Trong Kong Bằng Giao Diện Konga UI**

Bây giờ bạn đã có **Konga UI** chạy tại `http://localhost:7337`

***

### ✅ **1. Thêm Auth Service Vào Kong**

📌 **Mục tiêu:** Định tuyến request từ Kong đến **Auth Service (FastAPI) trên cổng `8800`**.

#### **🔹 Bước 1: Truy cập Konga UI**

* Mở trình duyệt và truy cập **`http://localhost:7337`**.
* Đăng nhập vào Konga.

#### **🔹 Bước 2: Thêm Auth Service**

1. Vào **"Services"** → Click **"Add Service"**.
2. Điền thông tin:
   * **Name**: `auth-service`
   * **URL**: `http://auth-service:8800`
   * **Protocol**: `http`
3. Click **"Submit"**.

📌 **Mục đích:** Bây giờ Kong biết Auth Service đang chạy ở đâu.

#### **🔹 Bước 3: Thêm Route Cho Auth Service**

1. Vào **"Routes"** → Click **"Add Route"**.
2. Tên **Route**: `auth-route`.
3. Nhập **paths**: `/auth/register, /auth/login, /auth/refresh-token, /auth/verify-email,` /auth/logout, /auth/revoke-token,  /auth/verify-email/initiate, /auth/forgot-password, /auth/reset-password, /auth/change-password, /auth/profile, /auth/profile/email, /auth/profile/permanent  ⇒ Enter từng path để lưu
4. **Strip Path** chọn: **NO** (Để lấy path y như server là /auth/...)
5. Click **"Submit"**.
6. Thêm **Router** cho /health riêng (Vì /health không thuộc /auth/ mà đang muốn cho nó dạng /auth/health)
7. Tên **Route**: `auth-health-route`.
8. Nhập **paths**: `/auth/health` ⇒ Enter để lưu
9. Strip Path chọn: **YES** (NO Hay YES ở đây không quan trọng bởi vì tí nữa sẽ bị ghi đè chuyển tới /health của server gốc)
10. Click **"Submit"**.
11. Thêm Plugin request-transformer
12. reaplace.uri: /health
13. Submit

#### 🔹 **Cách hoạt động của Strip Path**

* Nếu **Strip Path = true** (Mặc định):
  * Kong sẽ loại bỏ phần **Path** của Route trước khi chuyển tiếp yêu cầu đến Service.
  * Ví dụ:
    * Route có **Path**: `/api/v1`
    * Service có **URL**: `http://backend:5000`
    * Client gửi yêu cầu: `GET http://kong-gateway/api/v1/users`
    * Kong sẽ gửi đến Service: `GET http://backend:5000/users`
* Nếu **Strip Path = false**:
  * Kong sẽ giữ nguyên đường dẫn của yêu cầu khi chuyển tiếp đến Service.
  * Ví dụ:
    * Route có **Path**: `/api/v1`
    * Service có **URL**: `http://backend:5000`
    * Client gửi yêu cầu: `GET http://kong-gateway/api/v1/users`
    * Kong sẽ gửi đến Service: `GET http://backend:5000/api/v1/users`

***

#### 🔹 **Khi nào nên bật hoặc tắt Strip Path?**

* **Bật Strip Path (`true`)** khi backend service không cần biết prefix `/api/v1` mà chỉ cần nhận endpoint chính (`/users`, `/products`...).
* **Tắt Strip Path (`false`)** nếu backend service được thiết kế để xử lý đường dẫn đầy đủ, chẳng hạn như một hệ thống microservices có API Gateway chung nhưng service backend có namespace riêng.

