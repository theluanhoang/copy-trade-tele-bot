# Sử dụng một image chính thức của Python
FROM python:3.9-slim

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file requirements.txt vào container
COPY requirements.txt .

RUN pip install --upgrade pip \ 
    && pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn vào container
COPY . .

COPY .env .

EXPOSE 80

# Chạy ứng dụng
CMD ["python", "server.py"]