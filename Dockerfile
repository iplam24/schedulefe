# Bước 1: Build ứng dụng
FROM node:20-slim AS build
WORKDIR /app

# Copy package files để cài dependencies trước (tận dụng cache)
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Bước 2: Dùng Nginx để chạy ứng dụng đã build
FROM nginx:stable-alpine
# Copy các file đã build từ bước 1 vào thư mục phục vụ của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình Nginx để hỗ trợ Vue Router (nếu bạn có dùng)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]