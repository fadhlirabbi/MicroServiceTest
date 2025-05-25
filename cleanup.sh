#!/bin/bash

# Hapus semua resource Kubernetes
kubectl delete -f k8s/

# Hentikan Minikube
minikube stop
minikube delete

# Hapus Docker images
docker rmi backend frontend --force

echo "🛑 Menghentikan semua tunnel Ngrok..."
kill -f "ngrok" || echo "Info: Tidak ada proses Ngrok yang berjalan"

echo "🛀 Environment sudah dibersihkan!"