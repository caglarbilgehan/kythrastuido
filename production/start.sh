#!/usr/bin/env bash
set -e

BASE_DIR="$HOME/projects/open-projects/playground/music/kythrastudio/production"
VENV_ACTIVATE="$HOME/projects/open-projects/playground/music/.venv/bin/activate"
PORT="${PORT:-8001}"

# Ctrl+C yapıldığında arka plandaki 3 servisi de temizce kapat
cleanup() {
  echo ""
  echo "Servisler kapatılıyor..."
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM

# 1. Backend (Python API - Varsayılan 8001)
echo "[1/3] Backend başlatılıyor (port: $PORT)..."
source "$VENV_ACTIVATE"
cd "$BASE_DIR"
uvicorn backend.api.main:app --reload --host 0.0.0.0 --port "$PORT" &

# 2. Developer Workbench (5174 -> /api proxy: 127.0.0.1:8001)
echo "[2/3] Developer Workbench başlatılıyor..."
(cd "$BASE_DIR/developer" && npm run dev) &

# 3. Web (3000 -> /api proxy: 127.0.0.1:8001)
echo "[3/3] Web başlatılıyor..."
(cd "$BASE_DIR/web" && npm run dev) &

echo "Tüm servisler çalışıyor. Durdurmak için Ctrl+C'ye bas."
wait