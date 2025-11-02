# 🚀 Microservice Chat Demo dengan Minikube & Ngrok

[![Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-Nginx%20%7C%20JS%20%7C%20HTML-blue.svg)]()
[![Deployment](https://img.shields.io/badge/Orchestration-Kubernetes%20%7C%20Minikube-blueviolet.svg)]()

Proyek ini adalah demonstrasi sederhana arsitektur microservice 2-tingkat (two-tier) yang di-deploy menggunakan **Kubernetes (Minikube)**. Aplikasi ini berfungsi sebagai papan pesan (message board) sederhana di mana pesan disimpan di MongoDB.

Script `setup.sh` memudahkan proses *build* Docker, *deployment* Kubernetes, dan membuat akses eksternal melalui Ngrok.

***

## 💡 Arsitektur Microservice

Aplikasi ini dibagi menjadi dua layanan utama yang berinteraksi melalui *Service Discovery* Kubernetes:

| Layanan | Teknologi | Fungsi | Port |
| :--- | :--- | :--- | :--- |
| **Frontend** | Nginx (Alpine), HTML, CSS, JavaScript | Menyajikan file statis dan berfungsi sebagai *Reverse Proxy*. | 80 |
| **Backend** | Node.js, Express, Mongoose | API REST untuk operasi CRUD pesan. Terhubung ke MongoDB Atlas. | 3000 |

### Alur Komunikasi

1.  User mengakses **Frontend Service** (melalui Ngrok atau LoadBalancer Minikube).
2.  Permintaan API dari Frontend (`/api/messages`) di-*intercept* oleh Nginx.
3.  Nginx mem-proxy permintaan tersebut ke `http://backend-service:3000` di dalam cluster Kubernetes.
4.  **Backend** memproses permintaan (membaca/menulis ke MongoDB).

***

## 🛠️ Prasyarat

Pastikan semua *dependency* berikut telah terinstal dan tersedia di *path* sistem Anda (script `setup.sh` akan memeriksanya):

* **Docker**
* **Minikube**
* **Kubectl**
* **Node.js**
* **Ngrok** (Harus sudah terautentikasi)
* **jq** (Diperlukan oleh `setup.sh` untuk parsing URL Ngrok)

***

## 📦 Panduan Instalasi & Deploy

Gunakan script `setup.sh` untuk otomatisasi seluruh proses deploy.

### 1. Kloning Repositori

```bash
git clone [URL_REPO_ANDA]
cd MicroServiceTest-ea0c7a6ae39905f5b9d7ae14106cb1bdc124b55b
