#!/bin/bash

set -e

################################################
# Blue-Green Rollback Script
#
# Usage: ./scripts/rollback.sh
#
# Switches nginx back to the previously active
# color and restarts those containers.
################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.blue-green.yml"
UPSTREAM_FILE="$PROJECT_ROOT/nginx/upstream.conf"
FRONTEND_PARENT_UPSTREAM_FILE="$PROJECT_ROOT/nginx/frontend-parent-upstream.conf"
STATE_FILE="$PROJECT_ROOT/.deployment-state"

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
    if [ -f "$STATE_FILE" ]; then cat "$STATE_FILE"; else echo "blue"; fi
}

get_inactive_color() {
    local active; active=$(get_active_color)
    if [ "$active" = "blue" ]; then echo "green"; else echo "blue"; fi
}

main() {
    cd "$PROJECT_ROOT"

    CURRENT_COLOR=$(get_active_color)
    ROLLBACK_COLOR=$(get_inactive_color)

    log_warning "========================================="
    log_warning "  Rolling back deployment"
    log_warning "  Current active : $CURRENT_COLOR"
    log_warning "  Rolling back to: $ROLLBACK_COLOR"
    log_warning "========================================="

    # Check that rollback target containers exist
    if ! docker ps -a --filter "name=app_${ROLLBACK_COLOR}" | grep -q "app_${ROLLBACK_COLOR}"; then
        log_error "Container app_${ROLLBACK_COLOR} does not exist — cannot rollback"
        log_error "You may need to do a full redeploy instead"
        exit 1
    fi

    # Start rollback containers
    log_info "Starting app_${ROLLBACK_COLOR} and queue_${ROLLBACK_COLOR}..."
    docker compose -f "$COMPOSE_FILE" start "app_${ROLLBACK_COLOR}" "queue_${ROLLBACK_COLOR}" 2>/dev/null || \
        docker compose -f "$COMPOSE_FILE" up -d "app_${ROLLBACK_COLOR}" "queue_${ROLLBACK_COLOR}"

    # Start rollback frontend-parent container (if present)
    if docker ps -a --filter "name=frontend_parent_${ROLLBACK_COLOR}" | grep -q "frontend_parent_${ROLLBACK_COLOR}"; then
        log_info "Starting frontend_parent_${ROLLBACK_COLOR}..."
        docker compose -f "$COMPOSE_FILE" start "frontend_parent_${ROLLBACK_COLOR}" 2>/dev/null || \
            docker compose -f "$COMPOSE_FILE" up -d "frontend_parent_${ROLLBACK_COLOR}"
    fi

    # Wait for rollback containers to be healthy
    log_info "Waiting for app_${ROLLBACK_COLOR} to be healthy..."
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        health=$(docker inspect --format='{{.State.Health.Status}}' "app_${ROLLBACK_COLOR}" 2>/dev/null || echo "not_found")
        if [ "$health" = "healthy" ]; then
            log_success "app_${ROLLBACK_COLOR} is healthy"
            break
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    if [ "$health" != "healthy" ]; then
        log_error "Rollback target app_${ROLLBACK_COLOR} is not healthy — aborting"
        exit 1
    fi

    # Switch nginx upstream back
    log_info "Switching nginx upstream to $ROLLBACK_COLOR..."
    cat > "$UPSTREAM_FILE" <<EOF
# Active upstream configuration
# Managed by rollback.sh — DO NOT EDIT MANUALLY
# Last updated: $(date)
# Active color: $ROLLBACK_COLOR (ROLLBACK)

upstream php_backend {
    server app_${ROLLBACK_COLOR}:9000;
}
EOF

    # Switch frontend-parent upstream back too (if its container exists)
    if docker ps -a --filter "name=frontend_parent_${ROLLBACK_COLOR}" | grep -q "frontend_parent_${ROLLBACK_COLOR}"; then
        log_info "Switching frontend-parent upstream to $ROLLBACK_COLOR..."
        cat > "$FRONTEND_PARENT_UPSTREAM_FILE" <<EOF
# Active frontend-parent upstream configuration
# Managed by rollback.sh — DO NOT EDIT MANUALLY
# Last updated: $(date)
# Active color: $ROLLBACK_COLOR (ROLLBACK)

upstream frontend_parent_backend {
    server frontend_parent_${ROLLBACK_COLOR}:80;
}
EOF
    fi

    if docker exec nginx nginx -t 2>/dev/null; then
        docker exec nginx nginx -s reload
        sleep 2
        log_success "Nginx reloaded — now routing to $ROLLBACK_COLOR"
    else
        log_warning "Nginx config test failed, restarting nginx..."
        docker restart nginx
        sleep 5
    fi

    # Save rolled-back state
    echo "$ROLLBACK_COLOR" > "$STATE_FILE"
    log_success "State saved: $ROLLBACK_COLOR is now active"

    # Stop the bad deployment
    log_info "Stopping $CURRENT_COLOR containers..."
    docker compose -f "$COMPOSE_FILE" stop "app_${CURRENT_COLOR}" "queue_${CURRENT_COLOR}"
    docker compose -f "$COMPOSE_FILE" stop "frontend_parent_${CURRENT_COLOR}" 2>/dev/null || true

    log_success "========================================="
    log_success "  Rollback completed!"
    log_success "  Active now : $ROLLBACK_COLOR"
    log_success "  Stopped    : $CURRENT_COLOR"
    log_success "========================================="

    docker compose -f "$COMPOSE_FILE" ps
}

main "$@"
