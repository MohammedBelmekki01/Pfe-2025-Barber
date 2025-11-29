# 🚀 Deployment Guide

This guide will help you deploy your Barbershop Management System to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations reviewed
- [ ] Frontend built successfully
- [ ] API endpoints tested
- [ ] Security measures in place

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in your backend directory with production settings:

```env
APP_NAME="Barbershop Manager"
APP_ENV=production
APP_KEY=your-generated-key-here
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=your-domain.com

MAIL_MAILER=smtp
MAIL_HOST=your-mail-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Frontend Environment Variables

Create a `.env.production` file in your frontend directory:

```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=Barbershop Manager
```

## 🌐 Deployment Options

### Option 1: Traditional VPS/Server

#### Backend Deployment

1. **Install Requirements:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2+
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install nginx
```

2. **Deploy Laravel:**

```bash
# Clone repository
git clone https://github.com/Mohcinelahfari/Pfe-2025-Barber.git
cd Pfe-2025-Barber/backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Setup environment
cp .env.example .env
nano .env  # Edit with your production settings

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

3. **Configure Nginx:**

```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    root /path/to/Pfe-2025-Barber/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Frontend Deployment

1. **Build the Frontend:**

```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Web Server:**

```bash
# Copy build files to web server
sudo cp -r dist/* /var/www/html/barbershop/
```

3. **Configure Nginx for Frontend:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/barbershop;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Using Laravel Forge

1. Create a new server on [Laravel Forge](https://forge.laravel.com)
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy with one click

### Option 3: Using Docker

Create a `docker-compose.yml` in the root:

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - DB_DATABASE=barbershop
      - DB_USERNAME=root
      - DB_PASSWORD=secret
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=barbershop
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:
```

Then run:

```bash
docker-compose up -d
```

### Option 4: Using Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**

```bash
cd frontend
vercel --prod
```

**Backend on Railway:**

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select backend folder
5. Add environment variables
6. Deploy

## 🔒 Security Best Practices

### Backend Security

1. **SSL Certificate:**

```bash
# Using Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

2. **Environment Security:**

- Never commit `.env` files
- Use strong database passwords
- Rotate API keys regularly
- Enable CSRF protection
- Use rate limiting

3. **Laravel Security:**

```bash
# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Update dependencies
composer update --with-all-dependencies
```

### Frontend Security

1. **API Security:**

- Always use HTTPS
- Implement CORS properly
- Store tokens securely (httpOnly cookies)
- Validate all user inputs

2. **Build Security:**

- Remove console.log statements
- Minify and obfuscate code
- Use environment variables for sensitive data

## 📊 Performance Optimization

### Backend

```bash
# Install OPcache
sudo apt install php8.2-opcache

# Enable Redis for caching (optional)
sudo apt install redis-server
composer require predis/predis

# Configure queue workers
sudo apt install supervisor
```

### Frontend

1. **Optimize Build:**

```bash
# Analyze bundle size
npm run build -- --stats

# Use lazy loading for routes
# Optimize images
# Enable compression
```

2. **CDN Setup:**

- Use Cloudflare for CDN
- Enable caching
- Minify assets

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/project
            git pull
            cd backend
            composer install --no-dev
            php artisan migrate --force
            php artisan config:cache

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to hosting
```

## 🐛 Troubleshooting

### Common Issues

1. **500 Error:**

   - Check storage permissions
   - Clear cache
   - Check error logs

2. **Database Connection Error:**

   - Verify credentials
   - Check firewall rules
   - Ensure database server is running

3. **CORS Issues:**
   - Update CORS config
   - Check SANCTUM_STATEFUL_DOMAINS
   - Verify frontend URL

## 📞 Support

For deployment issues:

- Check Laravel logs: `storage/logs/laravel.log`
- Check Nginx logs: `/var/log/nginx/error.log`
- Contact: [Your Support Email]

---

**Remember:** Always test in a staging environment before deploying to production!
