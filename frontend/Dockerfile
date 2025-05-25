FROM nginx:alpine

# Salin file konfigurasi
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin file aplikasi
COPY . /usr/share/nginx/html

EXPOSE 80