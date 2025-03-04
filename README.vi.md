# RumAI - AI hỗ trợ học tiếng Nga

![RumAI Logo](https://rumai.app/logo.png)

**RumAI** là một nền tảng học tiếng Nga miễn phí, mã nguồn mở, sử dụng AI để cá nhân hóa trải nghiệm học tập, hỗ trợ dịch thuật, luyện kỹ năng nghe nói và xây dựng cộng đồng học tập.

📌 **Trang chủ:** [https://rumai.app](https://rumai.app)  
📌 **GitHub:** [https://github.com/codarkat/rumai](https://github.com/codarkat/rumai)  
📌 **Tài liệu dự án:** [https://docs.rumai.app](https://docs.rumai.app)

## 🚀 Tính năng

### ✅ Tính năng chính
- **Làm quen tiếng Nga**: Bảng chữ cái, bảng chia cách, bảng chia động từ,...
- **Bài tập cá nhân hoá**: Học theo trình độ và lịch sử tương tác.
- **Dịch tự động & Giải thích ngữ pháp**: Nhận diện văn bản (OCR), phân tích và dịch thuật.
- **Chatbot Gia sư AI**: Trò chuyện hỗ trợ bằng **tiếng Việt & tiếng Nga**, giải thích ngữ pháp, từ vựng.

### 🔥 Tính năng nâng cao (Phát triển sau)
- **Nhận diện giọng nói**: Cải thiện phát âm với phản hồi từ AI.
- **Học theo ngữ cảnh**: Học từ vựng, ngữ pháp qua văn bản, phim ảnh.
- **Theo dõi tiến độ học tập**: Lịch sử học và gợi ý bài học.
- **Cộng đồng học tập**: Hỏi đáp, chia sẻ kinh nghiệm với người học khác.

## 🛠️ Hướng dẫn cài đặt

Có hai cách cài đặt dự án: sử dụng Docker hoặc cài đặt trực tiếp để phát triển cục bộ.

### Sử dụng Docker

```bash
git clone https://github.com/codarkat/rumai.git
cd rumai
docker-compose up --build
```

### Cài đặt dự án (Phát triển cục bộ)

1. Cài đặt các package từ file requirements.txt:
   ```bash
   pip install -r requirements.txt
   ```

2. Sao chép file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
   
3. Cập nhật các biến môi trường trong file `.env` với thông tin của bạn.

4. Chạy script thiết lập cấu hình:
   ```bash
   python setup_config.py
   ```

5. Khởi chạy migrations:
   ```bash
   alembic upgrade head
   ```

## 🤝 Cộng tác

Chúng tôi luôn hoan nghênh đóng góp từ cộng đồng! Nếu bạn muốn tham gia phát triển hoặc có ý kiến đóng góp, hãy xem hướng dẫn trong **[CONTRIBUTING.md](CONTRIBUTING.md)**.

### **Thành viên chính**
- **Vũ Xuân Cảnh** - Project Manager, Backend Developer, DevOps Engineer, Technical Writer (**CODARKAT Team**)
- **Lê Đình Cường** - Scrum Master, UI/UX Designer, Frontend Developer (**CODARKAT Team**)
- **Lê Trung Kiên** - AI Engineer (**MIREA Team**)
- **Đỗ Linh** - Russian Language Expert (**MIREA Team**)

## 📜 Giấy phép

Dự án được cấp phép theo **MIT License**.  
Xem chi tiết trong **[LICENSE](LICENSE)**.