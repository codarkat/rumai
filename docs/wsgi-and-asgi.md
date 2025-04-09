---
hidden: true
---

# WSGI & ASGI

WSGI (Web Server Gateway Interface) và ASGI (Asynchronous Server Gateway Interface) là các tiêu chuẩn giao tiếp giữa máy chủ web và ứng dụng web trong hệ sinh thái Python, nhưng chúng phục vụ các mục đích khác nhau:

* **WSGI:**
  * Là tiêu chuẩn giao tiếp truyền thống cho các ứng dụng web Python.
  * Nó hoạt động theo mô hình đồng bộ (synchronous), nghĩa là mỗi yêu cầu được xử lý tuần tự.
  * Nhiều framework như Flask, Django (trong chế độ đồng bộ) sử dụng WSGI.
  * Ưu điểm của WSGI là đơn giản và ổn định, tuy nhiên nó không tối ưu cho các ứng dụng cần xử lý nhiều kết nối đồng thời hay thời gian thực.
* **ASGI:**
  * Là tiêu chuẩn mới, được thiết kế để hỗ trợ lập trình bất đồng bộ (asynchronous).
  * ASGI cho phép xử lý nhiều yêu cầu cùng lúc và hỗ trợ các giao thức không chỉ là HTTP mà còn các giao thức như WebSocket.
  * Các framework hiện đại như FastAPI, Django Channels sử dụng ASGI để tận dụng khả năng xử lý đồng thời, từ đó cải thiện hiệu năng của ứng dụng thời gian thực hoặc có lưu lượng truy cập lớn.

Tóm lại, trong khi WSGI phù hợp với các ứng dụng truyền thống xử lý yêu cầu đồng bộ, ASGI mở rộng khả năng của Python để xây dựng các ứng dụng hiện đại, đáp ứng nhu cầu về bất đồng bộ và giao tiếp theo thời gian thực.
