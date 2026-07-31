#!/bin/bash

set -e

################################################
# Zero-Downtime Blue-Green Deployment Script
#
# Usage: ./scripts/deploy-zero-downtime.sh
#
# What it does:
#   1. git pull
#   2. Build React frontend (yarn build)
#   3. Build new backend Docker image (inactive color)
#   4. Start inactive app + queue containers
#   5. Wait for health check
#   6. Run migrations + cache
#   7. Switch nginx upstream to inactive
#   8. Reload nginx
#   9. Save new active state
#  10. Stop old containers
#  11. Ensure scheduler is running
#  12. Prune old images and cleanup
################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"           # backend repo root
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.blue-green.yml"
UPSTREAM_FILE="$PROJECT_ROOT/nginx/upstream.conf"
FRONTEND_PARENT_UPSTREAM_FILE="$PROJECT_ROOT/nginx/frontend-parent-upstream.conf"
STATE_FILE="$PROJECT_ROOT/.deployment-state"
FRONTEND_DIR="$(dirname "$PROJECT_ROOT")/frontend"               # sibling main frontend repo
FRONTEND_PARENT_DIR="$(dirname "$PROJECT_ROOT")/frontend-parent" # sibling parent frontend repo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

get_active_color() {
    if [ -f "$STATE_FILE" ]; then
        cat "$STATE_FILE"
    else
        echo "blue"
    fi
}

get_inactive_color() {
    local active
    active=$(get_active_color)
    if [ "$active" = "blue" ]; then echo "green"; else echo "blue"; fi
}

wait_for_health() {
    local container=$1
    local max_attempts=150
    local attempt=1

    log_info "Waiting for $container to be healthy..."

    while [ $attempt -le $max_attempts ]; do
        health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "not_found")
        if [ "$health_status" = "healthy" ]; then
            log_success "$container is healthy!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo ""
    log_error "$container failed to become healthy after $((max_attempts * 2)) seconds"
    return 1
}

test_app() {
    local color=$1
    local container="app_${color}"
    local max_attempts=10
    local attempt=1

    log_info "Testing application on $container..."
    while [ $attempt -le $max_attempts ]; do
        if docker exec "$container" php artisan --version &>/dev/null; then
            log_success "Application test passed on $container"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done

    log_error "Application test failed on $container"
    return 1
}

switch_upstream() {
    local new_color=$1
    local new_upstream="app_${new_color}:9000"

    log_info "Switching nginx upstream to $new_color ($new_upstream)..."

    cat > "$UPSTREAM_FILE" <<EOF
# Active upstream configuration
# Managed by deploy-zero-downtime.sh — DO NOT EDIT MANUALLY
# Last updated: $(date)
# Active color: $new_color

upstream php_backend {
    server $new_upstream;
}
EOF

    sleep 1

    if docker exec nginx nginx -t 2>/dev/null; then
        docker exec nginx nginx -s reload
        sleep 2
        log_success "Nginx reloaded — active upstream: $new_color"
    else
        log_warning "Nginx config test failed, attempting full restart..."
        docker restart nginx
        sleep 5
        if ! docker exec nginx nginx -t 2>/dev/null; then
            log_error "Nginx is broken after restart — manual intervention required"
            return 1
        fi
        log_success "Nginx restarted successfully"
    fi
}

switch_frontend_parent_upstream() {
    local new_color=$1
    local new_upstream="frontend_parent_${new_color}:80"

    log_info "Switching frontend-parent upstream to $new_color ($new_upstream)..."

    cat > "$FRONTEND_PARENT_UPSTREAM_FILE" <<EOF
# Active frontend-parent upstream configuration
# Managed by deploy-zero-downtime.sh — DO NOT EDIT MANUALLY
# Last updated: $(date)
# Active color: $new_color

upstream frontend_parent_backend {
    server $new_upstream;
}
EOF

    sleep 1

    if docker exec nginx nginx -t 2>/dev/null; then
        docker exec nginx nginx -s reload
        sleep 2
        log_success "Nginx reloaded — frontend-parent active upstream: $new_color"
    else
        log_warning "Nginx config test failed after frontend-parent switch, attempting full restart..."
        docker restart nginx
        sleep 5
        if ! docker exec nginx nginx -t 2>/dev/null; then
            log_error "Nginx is broken after restart — manual intervention required"
            return 1
        fi
        log_success "Nginx restarted successfully"
    fi
}

save_state() {
    echo "$1" > "$STATE_FILE"
    log_info "Deployment state saved: $1 is now active"
}

ensure_scheduler() {
    log_info "Ensuring scheduler container is running..."
    if ! docker ps --filter "name=scheduler" --filter "status=running" | grep -q scheduler; then
        log_warning "Scheduler is not running — starting it..."
        docker compose -f "$COMPOSE_FILE" up -d scheduler
        log_success "Scheduler started"
    else
        log_success "Scheduler is already running"
    fi
}

build_frontend() {
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_warning "Frontend directory not found at $FRONTEND_DIR — skipping frontend build"
        return 0
    fi

    log_info "Building React frontend..."
    cd "$FRONTEND_DIR"

    if command -v yarn &>/dev/null; then
        yarn install --frozen-lockfile
        yarn build
    else
        log_warning "yarn not found, falling back to npm..."
        npm ci
        npm run build
    fi

    cd "$PROJECT_ROOT"
    log_success "Frontend build complete — dist ready at $FRONTEND_DIR/dist"
}

# Pull latest code for the parent frontend repo. The Vite build itself happens
# inside the Docker image build (see build_frontend_parent_image), so VITE_*
# vars are baked in from $FRONTEND_PARENT_DIR/.env at image-build time.
pull_frontend_parent() {
    if [ ! -d "$FRONTEND_PARENT_DIR" ]; then
        log_warning "Frontend-parent directory not found at $FRONTEND_PARENT_DIR — skipping"
        return 0
    fi

    if [ ! -f "$FRONTEND_PARENT_DIR/.env" ]; then
        log_warning "No .env found at $FRONTEND_PARENT_DIR/.env — VITE_* vars will be empty in the build!"
    fi
    if [ ! -f "$FRONTEND_PARENT_DIR/Dockerfile" ]; then
        log_warning "No Dockerfile at $FRONTEND_PARENT_DIR/Dockerfile — skipping frontend-parent"
        return 0
    fi

    log_info "Pulling frontend-parent (${FRONTEND_PARENT_DIR})..."
    if [ -d "$FRONTEND_PARENT_DIR/.git" ]; then
        git -C "$FRONTEND_PARENT_DIR" checkout -- . 2>/dev/null || true
        git -C "$FRONTEND_PARENT_DIR" pull --no-rebase
    else
        log_warning "Frontend-parent directory not a git repo — skipping frontend-parent pull"
    fi
}

main() {
    cd "$PROJECT_ROOT"

    log_info "========================================="
    log_info "  Zero-Downtime Blue-Green Deployment"
    log_info "========================================="

    # 1. Pull latest code from both repos
    log_info "Pulling backend (${PROJECT_ROOT})..."

    rm -f "$UPSTREAM_FILE"
    git -C "$PROJECT_ROOT" checkout -- . 2>/dev/null || true
    git -C "$PROJECT_ROOT" pull --no-rebase

    log_info "Pulling frontend (${FRONTEND_DIR})..."
    if [ -d "$FRONTEND_DIR/.git" ]; then
        git -C "$FRONTEND_DIR" checkout -- . 2>/dev/null || true
        git -C "$FRONTEND_DIR" pull --no-rebase
    else
        log_warning "Frontend directory not a git repo — skipping frontend pull"
    fi	

    # Pull frontend-parent code (build happens inside Docker image build)
    pull_frontend_parent

    # 2. Build React frontend
    build_frontend

    # 3. Determine colors
    ACTIVE_COLOR=$(get_active_color)
    INACTIVE_COLOR=$(get_inactive_color)
    log_info "Current active : $ACTIVE_COLOR"
    log_info "Deploying to   : $INACTIVE_COLOR"

    # 4. Build new backend image
    log_info "Building Docker image for app_${INACTIVE_COLOR}..."
    docker compose -f "$COMPOSE_FILE" build "app_${INACTIVE_COLOR}"

    # 4b. Build new frontend-parent image (Vite dist baked in at build time)
    if [ -f "$FRONTEND_PARENT_DIR/Dockerfile" ]; then
        log_info "Building Docker image for frontend_parent_${INACTIVE_COLOR}..."
        docker compose -f "$COMPOSE_FILE" build "frontend_parent_${INACTIVE_COLOR}"
    fi

    # 5. Start app container alone first — do NOT start queue yet.
    # Starting both together causes docker compose to enforce queue's
    # depends_on health condition inline with its own short internal timeout,
    # which fires before our custom wait_for_health below gets a chance to run.
    log_info "Starting app_${INACTIVE_COLOR}..."
    docker compose -f "$COMPOSE_FILE" up -d "app_${INACTIVE_COLOR}"

    # 5b. Start inactive frontend-parent container
    if [ -f "$FRONTEND_PARENT_DIR/Dockerfile" ]; then
        log_info "Starting frontend_parent_${INACTIVE_COLOR}..."
        docker compose -f "$COMPOSE_FILE" up -d "frontend_parent_${INACTIVE_COLOR}"
    fi

    # 6. Wait for app health (up to 300 s — composer install + migrations can take 3–4 min)
    if ! wait_for_health "app_${INACTIVE_COLOR}"; then
        log_error "Deployment aborted — app_${INACTIVE_COLOR} is unhealthy"
        log_warning "Keeping $ACTIVE_COLOR active. Stopping $INACTIVE_COLOR..."
        docker compose -f "$COMPOSE_FILE" stop "app_${INACTIVE_COLOR}"
        docker compose -f "$COMPOSE_FILE" stop "frontend_parent_${INACTIVE_COLOR}" 2>/dev/null || true
        exit 1
    fi

    # 6b. Wait for frontend-parent health (non-fatal if dir missing)
    if [ -f "$FRONTEND_PARENT_DIR/Dockerfile" ]; then
        if ! wait_for_health "frontend_parent_${INACTIVE_COLOR}"; then
            log_error "Deployment aborted — frontend_parent_${INACTIVE_COLOR} is unhealthy"
            log_warning "Keeping $ACTIVE_COLOR active. Stopping $INACTIVE_COLOR..."
            docker compose -f "$COMPOSE_FILE" stop "app_${INACTIVE_COLOR}" "frontend_parent_${INACTIVE_COLOR}"
            exit 1
        fi
    fi

    # App is healthy — now start the queue worker (depends_on will be satisfied immediately)
    log_info "Starting queue_${INACTIVE_COLOR}..."
    docker compose -f "$COMPOSE_FILE" up -d "queue_${INACTIVE_COLOR}"

    # 7. Run migrations
    log_info "Running database migrations on $INACTIVE_COLOR..."
    docker exec "app_${INACTIVE_COLOR}" php artisan migrate --force

    # 8. Clear and rebuild caches
    log_info "Rebuilding Laravel caches on $INACTIVE_COLOR..."
    docker exec "app_${INACTIVE_COLOR}" php artisan config:clear
    docker exec "app_${INACTIVE_COLOR}" php artisan route:clear
    docker exec "app_${INACTIVE_COLOR}" php artisan view:clear
    docker exec "app_${INACTIVE_COLOR}" php artisan event:clear
    docker exec "app_${INACTIVE_COLOR}" php artisan config:cache
    docker exec "app_${INACTIVE_COLOR}" php artisan route:cache
    docker exec "app_${INACTIVE_COLOR}" php artisan view:cache
    docker exec "app_${INACTIVE_COLOR}" php artisan event:cache

    # 9. Test application
    if ! test_app "$INACTIVE_COLOR"; then
        log_error "Deployment aborted — application test failed on $INACTIVE_COLOR"
        log_warning "Keeping $ACTIVE_COLOR active. Stopping $INACTIVE_COLOR..."
        docker compose -f "$COMPOSE_FILE" stop "app_${INACTIVE_COLOR}" "queue_${INACTIVE_COLOR}"
        exit 1
    fi

    # 10. Switch nginx upstream (backend)
    if ! switch_upstream "$INACTIVE_COLOR"; then
        log_error "Deployment aborted — failed to switch nginx upstream"
        log_warning "Keeping $ACTIVE_COLOR active. Stopping $INACTIVE_COLOR..."
        docker compose -f "$COMPOSE_FILE" stop "app_${INACTIVE_COLOR}" "queue_${INACTIVE_COLOR}"
        exit 1
    fi

    # 10b. Switch nginx upstream (frontend-parent, port 2060)
    if [ -f "$FRONTEND_PARENT_DIR/Dockerfile" ]; then
        if ! switch_frontend_parent_upstream "$INACTIVE_COLOR"; then
            log_error "Deployment aborted — failed to switch frontend-parent upstream"
            log_warning "Keeping $ACTIVE_COLOR active. Stopping $INACTIVE_COLOR..."
            docker compose -f "$COMPOSE_FILE" stop "app_${INACTIVE_COLOR}" "queue_${INACTIVE_COLOR}" "frontend_parent_${INACTIVE_COLOR}"
            exit 1
        fi
    fi

    # 11. Save new state
    save_state "$INACTIVE_COLOR"

    # 12. Wait to confirm traffic is stable
    log_info "Waiting 10 seconds to confirm traffic stability..."
    sleep 10

    # 13. Stop old containers
    log_info "Stopping old $ACTIVE_COLOR containers..."
    docker compose -f "$COMPOSE_FILE" stop "app_${ACTIVE_COLOR}" "queue_${ACTIVE_COLOR}"
    docker compose -f "$COMPOSE_FILE" stop "frontend_parent_${ACTIVE_COLOR}" 2>/dev/null || true

    # 14. Ensure scheduler is running
    ensure_scheduler

    # 15. Cleanup old images
    log_info "Pruning old Docker images..."
    docker image prune -f
    docker image prune -a --filter "until=24h" -f

    log_success "========================================="
    log_success "  Deployment completed successfully!"
    log_success "  Active  : $INACTIVE_COLOR"
    log_success "  Stopped : $ACTIVE_COLOR"
    log_success "========================================="

    log_info "Container status:"
    docker compose -f "$COMPOSE_FILE" ps

    log_info "Docker disk usage:"
    docker system df
}

main "$@"
