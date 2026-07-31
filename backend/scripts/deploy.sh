#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."  # project root

echo "⏳ Stashing any local changes…"
git stash --include-untracked

echo "⏳ Pulling latest from main…"
git pull origin main

echo "⏳ Restoring stashed changes…"
git stash pop || true

echo "⏳ Building Laravel images (app, queue, scheduler)…"
docker compose build app queue scheduler

echo "⏳ (Re)starting Laravel services…"
docker compose up -d app queue scheduler

echo "⏳ Waiting for PHP-FPM to spin up…"
sleep 5

echo "⏳ Preparing storage & cache directories…"
docker compose exec -T app bash -lc "\
  mkdir -p storage/framework/{cache,data,sessions,testing,views} bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache"

echo "⏳ Installing PHP dependencies…"
docker compose exec -T app composer install --no-interaction --prefer-dist --optimize-autoloader

echo "⏳ Running migrations & caching…"
docker compose exec -T app php artisan migrate --force
docker compose exec -T app php artisan config:cache
docker compose exec -T app php artisan route:cache
docker compose exec -T app php artisan view:cache
docker compose exec -T app php artisan event:cache

echo "⏳ Restarting queue & scheduler…"
docker compose restart queue scheduler

echo "🗑️  Pruning dangling images…"
docker image prune -f

echo "✅ Backend deploy complete!"
echo "🚀 Backend is ready to use!"