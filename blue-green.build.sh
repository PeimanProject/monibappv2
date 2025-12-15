#!/bin/bash

set -e


LOG_FILE="/var/log/nextjs-deploy.log"
DEPLOY_BASE="//home/monib-ai/"
NGINX_CONFIG="/etc/nginx/conf.d/client/monibapp.ir.conf"

BLUE_PORT=5001
GREEN_PORT=5002


log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}


CURRENT_PORT=$(grep -Po 'proxy_pass\s+http://localhost:\K[0-9]+' "$NGINX_CONFIG")

if [ "$CURRENT_PORT" == "$BLUE_PORT" ]; then
    ACTIVE="blue"
    IDLE="green"
    IDLE_PORT=$GREEN_PORT
else
    ACTIVE="green"
    IDLE="blue"
    IDLE_PORT=$BLUE_PORT
fi

IDLE_PATH="$DEPLOY_BASE/$IDLE/monib-ai-nx-b2"

log "🔄 Active: $ACTIVE ($CURRENT_PORT) | Deploying to: $IDLE (:$IDLE_PORT)"


cd "$IDLE_PATH"

log "📥 Pulling latest code from Git"
git reset --hard HEAD >> "$LOG_FILE" 2>&1
git clean -fd >> "$LOG_FILE" 2>&1
git pull >> "$LOG_FILE" 2>&1

log "📦 Installing dependencies with yarn"
yarn >> "$LOG_FILE" 2>&1

log "🏗️  Building project"
yarn build >> "$LOG_FILE" 2>&1

log "🔁 Restarting PM2 process from ecosystem.config.js"
pm2 restart ecosystem.config.js >> "$LOG_FILE" 2>&1

log "🕐 Waiting for service to start on port $IDLE_PORT..."
sleep 5


log "🔍 Health check on http://localhost:$IDLE_PORT/api/health"
if curl -fs http://localhost:$IDLE_PORT/health > /dev/null; then
    log "✅ New version healthy. Switching Nginx to $IDLE..."
    
    sudo sed -i -E "s|proxy_pass\s+http://localhost:[0-9]+;|proxy_pass http://localhost:$IDLE_PORT;|" "$NGINX_CONFIG"


    if grep -q "proxy_pass http://localhost:$IDLE_PORT;" "$NGINX_CONFIG"; then
        log "✅ Nginx config successfully updated to port $IDLE_PORT"
    else
        log "❌ Failed to update Nginx config. Aborting."
        exit 1
    fi


    sudo systemctl reload nginx
    log "✅ Switched to $IDLE. Deployment successful."
else
    log "❌ Health check failed. Rolling back..."
    log "🔁 Still using $ACTIVE. Deployment aborted."
    exit 1
fi
