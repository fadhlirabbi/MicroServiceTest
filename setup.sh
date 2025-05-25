#!/bin/bash

# File: setup.sh
# Usage: chmod +x setup.sh && ./setup.sh

# --------------------------
# Fungsi untuk mengecek dependency
# --------------------------
check_dependencies() {
    declare -a dependencies=("docker" "minikube" "kubectl" "node" "ngrok")
    for dep in "${dependencies[@]}"; do
        if ! command -v $dep &> /dev/null; then
            echo "Error: $dep tidak terinstall!"
            exit 1
        fi
    done
}

# --------------------------
# Fungsi untuk start Ngrok
# --------------------------
start_ngrok() {
    local SERVICE_URL=$(minikube service frontend-service --url)
    local IP_PORT=$(echo $SERVICE_URL | awk -F/ '{print $3}')
    
    echo "🌍 Starting Ngrok tunnel to $IP_PORT..."
    ngrok http $IP_PORT --host-header=rewrite > /dev/null &
    
    # Tunggu hingga tunnel ready
    sleep 5
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
    
    echo "🔗 Ngrok Public URL: $NGROK_URL"
}

# --------------------------
# Fungsi utama
# --------------------------
main() {
    echo "🚀 Memulai deploy aplikasi..."
    
    # 1. Cek dependency
    echo "🔍 Mengecek dependencies..."
    check_dependencies

    # 2. Start Minikube
    echo "🔌 Menyalakan Minikube cluster..."
    minikube start --driver=docker

    # 3. Set Docker environment
    echo "🐳 Mengatur Docker environment..."
    eval $(minikube docker-env)

    # 4. Build Docker images
    echo "🛠️ Membangun Docker images..."
    
    echo "📦 Membangun backend image..."
    cd backend
    docker build -t backend .
    cd ..
    
    echo "🎨 Membangun frontend image..."
    cd frontend
    docker build -t frontend .
    cd ..

    # 5. Deploy ke Kubernetes
    echo "☸️ Melakukan deploy ke Kubernetes..."
    kubectl apply -f k8s/

    # 6. Tunggu hingga pod ready
    echo "⏳ Menunggu pod menjadi ready..."
    kubectl wait --for=condition=Ready pods --all --timeout=120s

    # 7. Start Ngrok tunnel
    start_ngrok

    echo "✅ Selesai! Aplikasi berhasil di-deploy"
}

# --------------------------
# Eksekusi
# --------------------------
main "$@"