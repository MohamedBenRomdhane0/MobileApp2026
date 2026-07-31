#!/bin/sh

set -e

cd /var/www

echo "📦 Preparing Laravel environment..."

# Ensure required folders exist
mkdir -p storage/framework/{cache,data,sessions,testing,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Install PHP dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader

# Wait for DB
echo "⏳ Waiting for database db:3306..."
max_attempts=15
counter=1
until nc -z db 3306; do
  echo "❌ Attempt $counter failed. Retrying..."
  counter=$((counter+1))
  if [ $counter -gt $max_attempts ]; then
    echo "❌ Could not connect to database after $max_attempts attempts."
    exit 1
  fi
  sleep 2
done

echo "✅ DB is ready."

echo "🚀 Running Laravel prep tasks..."

php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear

php artisan migrate --force

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "✅ Laravel is ready."

# Start main container process (php-fpm or artisan serve)
exec "$@"
