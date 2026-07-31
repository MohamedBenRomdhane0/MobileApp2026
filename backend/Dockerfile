# Use official PHP FPM image
FROM php:8.2-fpm

ENV COMPOSER_ALLOW_SUPERUSER=1

# System libs
RUN apt-get update && apt-get install -y \
    git curl unzip zip ca-certificates gnupg \
    libpng-dev libonig-dev libxml2-dev libzip-dev zlib1g-dev libssl-dev \
    libfreetype6-dev libjpeg62-turbo-dev libwebp-dev \
    imagemagick ghostscript poppler-utils libmagickwand-dev \
    fonts-dejavu-core \
    ffmpeg netcat-openbsd iputils-ping supervisor \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js 20.x
RUN mkdir -p /etc/apt/keyrings \
 && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
 && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
 && apt-get update && apt-get install -y nodejs \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP extensions (GD already with WebP/Freetype/JPEG; add imagick via PECL)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip ftp \
 && pecl install imagick \
 && docker-php-ext-enable imagick

# Allow ImageMagick to READ PDFs (Debian disables by default for security).
# We only relax 'read' for PDF/PS/EPS; keep writes disabled.
RUN set -eux; \
  POLICY_FILE="/etc/ImageMagick-6/policy.xml"; \
  if [ -f "$POLICY_FILE" ]; then \
    sed -i 's#<policy domain="coder" rights="none" pattern="PDF" />#<policy domain="coder" rights="read" pattern="PDF" />#' "$POLICY_FILE" || true; \
    sed -i 's#<policy domain="coder" rights="none" pattern="PS" />#<policy domain="coder" rights="read" pattern="PS" />#' "$POLICY_FILE" || true; \
    sed -i 's#<policy domain="coder" rights="none" pattern="EPS" />#<policy domain="coder" rights="read" pattern="EPS" />#' "$POLICY_FILE" || true; \
  fi

# PHP settings
COPY php/local.ini /usr/local/etc/php/conf.d/local.ini

# Supervisor configs
COPY docker/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY docker/supervisor/laravel-worker.conf /etc/supervisor/conf.d/laravel-worker.conf
COPY docker/supervisor/reverb.conf /etc/supervisor/conf.d/reverb.conf
RUN mkdir -p /var/log/supervisor

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY --chown=www-data:www-data . /var/www

RUN mkdir -p /var/www/storage /var/www/bootstrap/cache \
 && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY --chown=root:root docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000 8000 8080
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["sh","-c","if [ \"$APP_ENV\" = 'production' ] || [ \"$APP_ENV\" = 'staging' ]; then php-fpm; else php artisan serve --host=0.0.0.0 --port=8000; fi"]
