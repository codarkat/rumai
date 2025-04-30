# bảng "users" chưa được tạo trong database. Chúng ta cần tạo bảng trước khi có thể sử dụng API
# 1. Đầu tiên, tạo file `alembic.ini.t.template` trong thư mục gốc của dự án:
#
# # Cài đặt alembic nếu chưa có
# pip install alembic
#
# # Khởi tạo migrations
# alembic init migrations
#
#
# 1. Sửa file `migrations/env.py` để import models và config:
#
# alembic revision --autogenerate -m "create users table"
#
#
# 1. Chạy migration để tạo bảng:
# alembic upgrade head
#
# 1. Thêm đoạn code sau vào `main.py` để tự động tạo bảng khi khởi động ứng dụng:
#
#
# # Tạo bảng khi khởi động
# Base.metadata.create_all(bind=engine)
#########################################################################
# Bo theo doi khoi git
# git rm -f --cached backend/auth_service_fastapi/notes.py
###########################################################################
# 1. **Tạo migration mới:**
# Sau khi đã cập nhật model (thêm các trường email_verified và last_login), hãy tạo một migration mới bằng lệnh:
# alembic revision --autogenerate -m "Add email_verified and last_login columns to users"
# Lệnh này sẽ tự động so sánh metadata của SQLAlchemy (được cấu hình qua Base.metadata trong env.py) với cấu trúc bảng hiện tại và tạo file migration phù hợp.
# 1. **Kiểm tra file migration:**
# Mở file migration vừa tạo (nằm trong thư mục migrations/versions) và kiểm tra xem các lệnh ALTER TABLE đã được tạo ra đúng với mong đợi. Ví dụ, bạn sẽ thấy các lệnh thêm cột:
#
# op.add_column('users', sa.Column('email_verified', sa.Boolean(), server_default=sa.text('false'), nullable=False))
# op.add_column('users', sa.Column('last_login', sa.TIMESTAMP(), nullable=True))
#
# 1. **Chạy migration:**
# Sau khi xác nhận file migration, chạy lệnh nâng cấp cơ sở dữ liệu:
# alembic upgrade head
############################################################################
# # 1. **Tạo token thủ công để test:** XAC NHAN EMAIL
# # Nếu bạn cần test endpoint mà không cần phải thực hiện quá trình gửi email, bạn có thể tạo token thủ công với cùng cấu hình như hệ thống bằng cách sử dụng thư viện JWT (ví dụ: sử dụng "python-jose").
# # Python
# from jose import jwt
#
# secret_key = "rumai_supersecretkey_mireavn"  # Thay đổi SECRET_KEY theo cấu hình của bạn
# algorithm = "HS256"  # Hoặc algorithm mà bạn đang sử dụng
# payload = {"sub": "xuancanhit@gmail.com"}  # Khớp với email hoặc thông tin cần xác thực
#
# token = jwt.encode(payload, secret_key, algorithm=algorithm)
# print("Generated token:", token)
############################################################################
# # 1. Xóa toàn bộ migration cũ (nếu có)
# Chi xoa khi loi va tao lai rm -rf migrations/versions/*
#
# # 2. Tạo migration mới
# alembic revision --autogenerate -m "create_users_table"
#
# # 3. Chạy migration
# alembic upgrade head
#######################################################################
# docker compose stop rumai-db
#
# # Xóa container và volume
# docker compose rm -f rumai-db
# docker volume rm rumai_postgres_data
# docker compose up -d rumai-db

# Test validate token
from jose import jwt
from config import config

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0MUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoiOGI2NDY4NjQtMjY3Zi00MjM2LWE0OGEtNmNjMjIwYTVlNGE3IiwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTc0Mzk1MjExN30.OBXp8ZLic918QkIJtzVzZKrK09Ka8UONJEOkdskHfoM"

try:
    payload = jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
    print("Token valid:", payload)
except jwt.JWTError as e:
    print("Token invalid:", str(e))

