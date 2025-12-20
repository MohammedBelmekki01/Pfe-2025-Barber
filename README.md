# 💈 Barbershop Management System

Projet PFE développé par Mohammed Belmekki et Mohsine Lahfari , enjoy : 


A modern, full-stack barbershop management application built with Laravel 12 and React TypeScript. This project is developed as a Final Year Project (PFE) demonstrating enterprise-level architecture and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

This Barbershop Management System is a comprehensive solution designed to streamline barbershop operations, manage appointments, handle customer relationships, and provide an intuitive user experience for both staff and clients.

**Project Type:** Final Year Project (PFE)  
**Academic Year:** 2024-2025  
**Status:** ✅ Production Ready

## ✨ Features

### Backend (Laravel 12)

- 🔐 **Authentication System** - Secure user authentication using Laravel Sanctum
- 👤 **User Management** - Role-based access control for administrators and staff
- 📅 **Appointment Management** - Schedule and manage customer appointments
- 💼 **Service Management** - Define and manage barbershop services
- 📊 **Dashboard & Analytics** - Real-time business insights
- 🔒 **RESTful API** - Well-structured API endpoints
- ✅ **Input Validation** - Robust data validation and error handling
- 🚀 **Performance Optimized** - Efficient database queries and caching

### Frontend (React + TypeScript)

- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite for optimal loading times
- 🧩 **Component Library** - Reusable components with Radix UI
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔄 **Real-time Updates** - Dynamic content updates without page refresh
- 🎯 **Type Safety** - Full TypeScript implementation
- 📋 **Form Management** - React Hook Form with Zod validation
- 🎭 **State Management** - Context API for global state

## 🛠️ Tech Stack

### Backend

- **Framework:** Laravel 12.x
- **Language:** PHP 8.2+
- **Authentication:** Laravel Sanctum
- **Database:** MySQL/PostgreSQL/SQLite
- **API:** RESTful API Architecture
- **Testing:** PHPUnit
- **Package Manager:** Composer

### Frontend

- **Framework:** React 19.x
- **Language:** TypeScript 5.8
- **Build Tool:** Vite 6.x
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI
- **Routing:** React Router DOM 7.x
- **HTTP Client:** Axios
- **Form Management:** React Hook Form + Zod
- **Icons:** Lucide React

## 📁 Project Structure

```
Pfe-2025-Barber/
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── AuthController.php
│   │   │       └── Controller.php
│   │   ├── Models/
│   │   │   └── User.php
│   │   └── Providers/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   │   ├── api.php
│   │   ├── console.php
│   │   └── web.php
│   ├── storage/
│   ├── tests/
│   ├── .env.example
│   ├── composer.json
│   └── artisan
│
├── frontend/                # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── assets/         # Static assets
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── Layouts/        # Layout components
│   │   ├── lib/            # Utility functions
│   │   ├── Pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── router/         # Route configuration
│   │   ├── Services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── v1/                      # Version 1 (Archive)
├── v2/                      # Version 2 (Archive)
└── README.md               # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **PHP** (8.2 or higher)
- **Composer** (2.x)
- **MySQL** (8.x) or **PostgreSQL** or **SQLite**
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MohammedBelmekki01/Pfe-2025-Barber.git
cd Pfe-2025-Barber
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# Then run migrations
php artisan migrate

# (Optional) Seed the database with sample data
php artisan db:seed

# Generate Sanctum secret key
php artisan sanctum:install
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node dependencies
npm install

# Create .env file for frontend (if needed)
cp .env.example .env
```

## ⚙️ Configuration

### Backend Configuration (.env)

```env
APP_NAME="Barbershop Manager"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barbershop_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Frontend Configuration

Update the API base URL in your frontend configuration:

```typescript
// frontend/src/api/axios.ts or similar
const API_BASE_URL = "http://localhost:8000/api";
```

## 🏃 Running the Application

### Option 1: Run Separately

**Terminal 1 - Backend:**

```bash
cd backend
php artisan serve
# Server running at http://localhost:8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Application running at http://localhost:3000
```

### Option 2: Run with Concurrently (Backend only)

```bash
cd backend
composer dev
# Runs Laravel server, queue, logs, and Vite simultaneously
```

Then in another terminal:

```bash
cd frontend
npm run dev
```

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint      | Description            | Auth Required |
| ------ | ------------- | ---------------------- | ------------- |
| POST   | `/api/login`  | User login             | No            |
| POST   | `/api/logout` | User logout            | Yes           |
| GET    | `/api/user`   | Get authenticated user | Yes           |

### Request Examples

**Login:**

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

**Get Authenticated User:**

```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📸 Screenshots

<!-- Add your application screenshots here -->

## 🧪 Testing

### Backend Tests

```bash
cd backend
php artisan test
```

### Frontend Tests (if configured)

```bash
cd frontend
npm run test
```

## 🏗️ Building for Production

### Backend

```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend

```bash
cd frontend
npm run build
# Output will be in the dist/ directory
```

## 📚 Version History

- **v2/** - Current active version (main development)
- **v1/** - Previous iteration (archived)

## 🤝 Contributing

This is a final year project (PFE), but suggestions and feedback are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mohammed Belmekki**

- GitHub: [@MohammedBelmekki01](https://github.com/MohammedBelmekki01)
- Repository: [Pfe-2025-Barber](https://github.com/MohammedBelmekki01/Pfe-2025-Barber)

## 🙏 Acknowledgments

- Laravel Framework
- React Community
- Vite Build Tool
- Tailwind CSS
- Radix UI
- All open-source contributors

## 📞 Contact

For any questions or inquiries about this project, please reach out through:

- GitHub Issues: [Create an issue](https://github.com/MohammedBelmekki01/Pfe-2025-Barber/issues)
- Email: belmekki.meh@gmail.com

---

**Note:** This project is developed as a Final Year Project (PFE) for academic purposes.

**⭐ If you find this project useful, please consider giving it a star!**
