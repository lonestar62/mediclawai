#!/usr/bin/env bash
# deploy.sh — MediclawAI marketing site deployment
# Usage: ./deploy.sh
# Runs on: fleet-vm | Port: 3020 | Service: mediclawai

set -euo pipefail

APP_DIR="/opt/mediclawai"
SERVICE="mediclawai"
REPO="https://github.com/lonestar62/mediclawai.git"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "=== MediclawAI Deploy ==="
echo "Branch: $BRANCH"
echo "Target: $APP_DIR"
echo ""

# Pull latest
if [ -d "$APP_DIR/.git" ]; then
  echo "→ Pulling latest..."
  cd "$APP_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  echo "→ Cloning repo..."
  git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# Install deps
echo "→ Installing dependencies..."
npm ci --production

# Ensure waitlist file exists
if [ ! -f "$APP_DIR/waitlist.json" ]; then
  echo "[]" > "$APP_DIR/waitlist.json"
  echo "→ Created empty waitlist.json"
fi

# Install & restart systemd service
echo "→ Installing systemd service..."
sudo cp "$APP_DIR/mediclawai.service" /etc/systemd/system/mediclawai.service
sudo systemctl daemon-reload
sudo systemctl enable mediclawai
sudo systemctl restart mediclawai

echo ""
echo "✅ Deploy complete."
echo "   Service: $(systemctl is-active mediclawai)"
echo "   Port:    3020"
echo "   Logs:    journalctl -u mediclawai -f"
