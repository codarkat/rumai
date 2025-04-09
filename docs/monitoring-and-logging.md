---
hidden: true
---

# Monitoring & Logging

Để triển khai hệ thống theo dõi (**monitoring** & **logging**) trong Docker Compose, bạn có thể tích hợp một trong các giải pháp phổ biến sau:

1. **Prometheus + Grafana** → Giám sát hiệu suất API, metrics từ Kong.
2. **Loki + Promtail + Grafana** → Theo dõi log chi tiết từ Kong và dịch vụ.
3. **ELK Stack (Elasticsearch + Logstash + Kibana)** → Phân tích log mạnh mẽ.
4. **Jaeger** → Theo dõi phân tán (tracing) các request.

Dưới đây là cách thiết lập **Prometheus + Grafana + Loki + Promtail** để theo dõi Kong API Gateway và `auth-service` trong **Docker Compose**.

***

### **1️⃣ Cấu hình Kong để hỗ trợ Prometheus**

Kong có plugin **Prometheus** giúp xuất metrics cho hệ thống giám sát.

#### **Bước 1: Bật plugin Prometheus trong Kong**

Thêm plugin Prometheus vào dịch vụ Kong bằng Konga hoặc Admin API:

```bash
bashCopyEditcurl -i -X POST http://localhost:7001/plugins \
  --data "name=prometheus"
```

Điều này cho phép Kong xuất metrics tại endpoint: `http://kong:7000/metrics`.

***

### **2️⃣ Cấu hình Prometheus**

Prometheus thu thập metrics từ Kong và các dịch vụ khác.

Tạo file cấu hình `prometheus.yml` trong thư mục `monitoring/prometheus/`:

```yaml
yamlCopyEditglobal:
  scrape_interval: 5s  # Thu thập dữ liệu mỗi 5 giây

scrape_configs:
  - job_name: 'kong'
    metrics_path: /metrics
    static_configs:
      - targets: ['kong:7000']
```

***

### **3️⃣ Cấu hình Grafana**

Grafana sẽ đọc dữ liệu từ Prometheus để hiển thị dashboard.

* Grafana sẽ chạy trên `http://localhost:3000`.
* Username/password mặc định: **admin/admin**.

***

### **4️⃣ Cấu hình Loki + Promtail (Theo dõi log)**

**Loki** giúp lưu trữ log và **Promtail** sẽ thu thập log từ Kong và `auth-service`.

Tạo file cấu hình `promtail-config.yml`:

```yaml
yamlCopyEditserver:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: "http://loki:3100/loki/api/v1/push"

scrape_configs:
  - job_name: "kong-logs"
    static_configs:
      - targets:
          - localhost
        labels:
          job: "kong"
          __path__: "/var/log/kong/*.log"

  - job_name: "auth-service-logs"
    static_configs:
      - targets:
          - localhost
        labels:
          job: "auth-service"
          __path__: "/var/log/auth/*.log"
```

***

### **5️⃣ Thêm vào `docker-compose.yml`**

Chỉnh sửa `docker-compose.yml` để thêm các service mới:

```yaml
yamlCopyEditversion: "3.8"

services:
  # Prometheus
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - monitoring-net
      - kong-net

  # Grafana
  grafana:
    image: grafana/grafana
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    ports:
      - "3000:3000"
    networks:
      - monitoring-net
    depends_on:
      - prometheus
      - loki

  # Loki (Logging system)
  loki:
    image: grafana/loki
    container_name: loki
    ports:
      - "3100:3100"
    networks:
      - monitoring-net

  # Promtail (Log collector)
  promtail:
    image: grafana/promtail
    container_name: promtail
    volumes:
      - ./monitoring/promtail-config.yml:/etc/promtail/config.yml
      - /var/log:/var/log  # Mount log folder
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring-net
    depends_on:
      - loki

networks:
  monitoring-net:
    driver: bridge
  kong-net:
    driver: bridge
```

***

### **6️⃣ Chạy hệ thống**

Sau khi đã cấu hình đầy đủ, chạy các dịch vụ:

```bash
bashCopyEditdocker-compose up -d
```

***

### **7️⃣ Truy cập dashboard**

* **Prometheus:** `http://localhost:9090`
* **Grafana:** `http://localhost:3000`
* **Loki API:** `http://localhost:3100`
* **Promtail (Log gửi về Loki)**

Trong **Grafana**, thêm **Prometheus** (`http://prometheus:9090`) và **Loki** (`http://loki:3100`) làm data sources.

***

### **8️⃣ Kiểm tra log**

* Kiểm tra log Kong:

```bash
bashCopyEditdocker logs kong
```

* Kiểm tra log Auth Service:

```bash
bashCopyEditdocker logs auth-service
```

* Kiểm tra log trong Prometheus:

```bash
bashCopyEditcurl http://localhost:9090/api/v1/targets
```

***

### **🔥 Kết luận**

Bạn đã triển khai thành công hệ thống **giám sát + logging** cho Kong và `auth-service`. Bây giờ bạn có thể:

✅ Giám sát API traffic bằng **Prometheus**.\
✅ Hiển thị biểu đồ và dashboard trong **Grafana**.\
✅ Thu thập log từ Kong và `auth-service` bằng **Loki + Promtail**.



## PROMETHEUS RUN port 7001 and 8001

### **Hướng dẫn sử dụng Plugin Datadog & Prometheus trong Kong**

Trong Kong, bạn có thể sử dụng các plugin **Datadog** và **Prometheus** để giám sát API Gateway. Dưới đây là cách cấu hình từng plugin và tích hợp chúng vào hệ thống.

***

## **1️⃣ Plugin Prometheus**

#### 🔹 **Tác dụng**

* Thu thập metrics từ Kong như số lượng request, độ trễ, lỗi HTTP.
* Giúp giám sát API traffic theo thời gian thực.
* Tích hợp dễ dàng với **Grafana** để tạo dashboard.

***

### **📌 Cách cài đặt Plugin Prometheus trong Kong**

#### **Bước 1: Bật plugin Prometheus**

Thêm plugin **Prometheus** vào Kong bằng Konga hoặc Kong Admin API.

**📌 Cách 1: Bật qua Admin API** Chạy lệnh sau để bật plugin:

```bash
bashCopyEditcurl -i -X POST http://localhost:7001/plugins \
  --data "name=prometheus"
```

**📌 Cách 2: Bật qua Konga**

1. **Truy cập Konga** → Chọn **Service** hoặc **Global Plugins**.
2. Nhấn **"Add Plugin"** → Chọn **Prometheus**.
3. Nhấn **"Create"** để lưu.

***

#### **Bước 2: Kiểm tra Metrics**

Sau khi cài đặt, Kong sẽ xuất metrics tại endpoint:

```bash
bashCopyEdithttp://kong:7000/metrics
```

Để kiểm tra, chạy:

```bash
bashCopyEditcurl http://localhost:7000/metrics
```

**Ví dụ Output:**

```plaintext
plaintextCopyEdit# HELP kong_http_status HTTP status codes per service/route in Kong
kong_http_status{service="auth-service",code="200"} 500
kong_http_status{service="auth-service",code="500"} 10
```

***

#### **Bước 3: Thêm Prometheus vào Docker Compose**

Trong `docker-compose.yml`, thêm service **Prometheus**:

```yaml
yamlCopyEdit  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - monitoring-net
      - kong-net
```

Tạo file `monitoring/prometheus.yml` để thu thập metrics từ Kong:

```yaml
yamlCopyEditglobal:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'kong'
    metrics_path: /metrics
    static_configs:
      - targets: ['kong:7000']
```

Sau đó khởi động lại:

```bash
bashCopyEditdocker-compose up -d
```

***

#### **Bước 4: Kết nối Grafana**

1. Truy cập **Grafana** (`http://localhost:3000`).
2. Thêm **Prometheus** làm **Data Source** (`http://prometheus:9090`).
3. Tạo dashboard với các biểu đồ giám sát API.





## GRAFANA

Bạn có thể cài đặt **Grafana** trong Docker Compose để tích hợp với **Prometheus** và giám sát API từ Kong. Dưới đây là hướng dẫn chi tiết để thiết lập Grafana cùng với Prometheus trong hệ thống của bạn.

***

### **1️⃣ Thêm Grafana vào `docker-compose.yml`**

Chỉnh sửa tệp `docker-compose.yml` và thêm service **Grafana** vào:

```yaml
yamlCopyEdit  grafana:
    image: grafana/grafana
    container_name: grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    ports:
      - "3000:3000"
    networks:
      - monitoring-net
    depends_on:
      - prometheus
      - loki
    volumes:
      - grafana_data:/var/lib/grafana
```

📌 **Giải thích cấu hình**:

* **`image: grafana/grafana`**: Dùng phiên bản Grafana mới nhất.
* **`ports: 3000:3000`**: Truy cập Grafana qua `http://localhost:3000`.
* **`GF_SECURITY_ADMIN_PASSWORD=admin`**: Đặt mật khẩu admin mặc định.
* **`depends_on: prometheus, loki`**: Chờ Prometheus và Loki chạy trước.

🔹 **Thêm network vào Docker Compose** nếu chưa có:

```yaml
yamlCopyEditnetworks:
  monitoring-net:
    driver: bridge
```

🔹 **Thêm volume để lưu dữ liệu Grafana**:

```yaml
yamlCopyEditvolumes:
  grafana_data:
```

***

### **2️⃣ Chạy lại Docker Compose**

Sau khi cập nhật `docker-compose.yml`, chạy lệnh sau để khởi động Grafana:

```bash
bashCopyEditdocker-compose up -d grafana
```

Sau khi khởi động thành công, truy cập Grafana tại:

```
arduinoCopyEdithttp://localhost:3000
```

* **Username:** `admin`
* **Password:** `admin` (hoặc giá trị bạn đặt)

***

### **3️⃣ Thêm Prometheus làm Data Source trong Grafana**

#### **Bước 1: Truy cập Grafana**

* Mở trình duyệt, nhập `http://localhost:3000`.
* Đăng nhập bằng tài khoản `admin / admin`.

#### **Bước 2: Thêm Prometheus**

* Vào **Configuration → Data Sources → Add Data Source**.
* Chọn **Prometheus**.
*   Ở phần `URL`, nhập:

    ```plaintext
    plaintextCopyEdithttp://prometheus:9090
    ```
* Nhấn **Save & Test** để kiểm tra kết nối.

***

### **4️⃣ Import Dashboard Kong vào Grafana**

Để hiển thị metrics Kong, bạn có thể import dashboard có sẵn từ **Grafana Labs**:

#### **Bước 1: Tải Kong API Gateway Dashboard**

* Vào `http://localhost:3000`
* Chọn **Create → Import**
* Nhập ID: **7424** (Kong Dashboard từ Grafana Labs)
* Nhấn **Load** và chọn **Prometheus** làm Data Source.
* Nhấn **Import** để hoàn tất.

📌 **Kết quả:** Bạn sẽ thấy các biểu đồ hiển thị:

* Tổng số requests.
* Latency API.
* Tỷ lệ lỗi HTTP.
* Request theo service.

***

### **5️⃣ Kiểm tra Grafana hoạt động**

Chạy lệnh kiểm tra logs Grafana:

```bash
bashCopyEditdocker logs grafana
```

Nếu có lỗi, thử khởi động lại:

```bash
bashCopyEditdocker-compose restart grafana
```

***

### **🔥 Kết luận**

✅ **Bạn đã cài đặt thành công Grafana để giám sát Kong API!**\
✅ **Có thể xem dashboard realtime từ Prometheus.**\
✅ **Có thể thêm Loki để giám sát logs Kong.**

