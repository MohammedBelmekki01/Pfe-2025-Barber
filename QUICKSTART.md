# ⚡ Quick Start Guide

Get your Barbershop Management System up and running in 5 minutes!

## 🎯 Prerequisites Quick Check

Run these commands to verify you have everything:

```powershell
# Check Node.js
node --version  # Should be v18+ 

# Check npm
npm --version

# Check PHP
php --version  # Should be 8.2+

# Check Composer
composer --version

# Check MySQL (optional if using SQLite)
mysql --version
```

## 🚀 Super Quick Setup (5 Minutes)

### 1️⃣ Clone the Repository (1 min)

```powershell
git clone https://github.com/Mohcinelahfari/Pfe-2025-Barber.git
cd Pfe-2025-Barber
```

### 2️⃣ Backend Setup (2 min)

```powershell
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env

# Generate key
php artisan key:generate

# Quick SQLite setup (no MySQL needed!)
php artisan migrate

# Start server
php artisan serve
```

**Backend now running at:** http://localhost:8000 ✅

### 3️⃣ Frontend Setup (2 min)

Open a NEW terminal:

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend now running at:** http://localhost:3000 ✅

## 🎉 You're Done!

Visit: http://localhost:3000

## 🔧 Quick Troubleshooting

### Backend Issues

**Problem:** `composer: command not found`
```powershell
# Install Composer
# Download from: https://getcomposer.org/download/
```

**Problem:** `php artisan migrate` fails
```powershell
# Use SQLite instead
# In .env, set: DB_CONNECTION=sqlite
# Create database file
New-Item database/database.sqlite
php artisan migrate
```

**Problem:** Port 8000 already in use
```powershell
# Use different port
php artisan serve --port=8001
```

### Frontend Issues

**Problem:** `npm: command not found`
```powershell
# Install Node.js from: https://nodejs.org/
```

**Problem:** Port 3000 already in use
```powershell
# Vite will automatically suggest another port
# Or specify: npm run dev -- --port 3001
```

**Problem:** API connection errors
```powershell
# Update API URL in frontend
# Edit: src/api/axios.ts or similar
# Set: baseURL: 'http://localhost:8000/api'
```

## 📱 Default Test Credentials

After running seeders:

```
Email: admin@barbershop.com
Password: password
```

## 🔥 One-Command Setup (Advanced)

### For Backend:
```powershell
cd backend; composer install; cp .env.example .env; php artisan key:generate; php artisan migrate; php artisan serve
```

### For Frontend:
```powershell
cd frontend; npm install; npm run dev
```

## 📚 Next Steps

1. ✅ Check out [README.md](README.md) for full documentation
2. ✅ Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. ✅ See [GITHUB_PUSH_GUIDE.md](GITHUB_PUSH_GUIDE.md) for version control
4. ✅ Explore the API at http://localhost:8000/api

## 🆘 Still Having Issues?

1. Check the [Issues](https://github.com/Mohcinelahfari/Pfe-2025-Barber/issues) page
2. Read the full [README.md](README.md)
3. Verify all prerequisites are installed
4. Check Laravel logs: `backend/storage/logs/laravel.log`

## 🎓 For PFE Evaluation

To demonstrate your project:

```powershell
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - (Optional) Watch logs
cd backend
php artisan tail
```

---

**Happy Coding! 💻**

**Remember:** Check the main [README.md](README.md) for comprehensive documentation!
