---
hidden: true
---

# OCR Service

### **7. Cách tối ưu chi phí Google Vision API**

#### **Giảm số lần gọi API**

* **Lưu cache OCR** bằng Redis để tránh gửi ảnh trùng lặp.
* **Nén ảnh** trước khi gửi để giảm thời gian xử lý.

#### **Kết hợp với OCR miễn phí**

* Dùng **Tesseract OCR** hoặc **EasyOCR** cho xử lý đơn giản.
* Chỉ dùng Google Vision OCR khi cần độ chính xác cao.
