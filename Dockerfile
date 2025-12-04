# 1. Chọn Base Image: Node.js bản nhẹ (Alpine)
FROM node:18-alpine

# 2. Tạo thư mục làm việc trong Container
WORKDIR /app

# 3. Copy file định nghĩa thư viện trước (để tận dụng Cache)
COPY package*.json ./

# 4. Cài đặt thư viện
RUN npm install

# 5. Copy toàn bộ source code vào trong Container
COPY . .

# 6. Khai báo port (chỉ để document)
EXPOSE 3000

# 7. Lệnh mặc định để chạy ứng dụng
CMD ["npm", "start"]