# 📋 Task Manager App

A full-stack web application for managing personal tasks, built with React, Node.js, Express, MySQL, and JWT authentication.

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, React Router, Formik, Yup, Bootstrap, Axios |
| Backend | Node.js, Express.js, MySQL2, JWT, bcryptjs |
| Database | MySQL |
| Auth | JSON Web Tokens (JWT) |

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── config/
│   │   ├── db.js            # MySQL connection pool
│   │   └── schema.sql       # Database schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── tests/
│   │   └── api.test.js
│   ├── .env.example
│   └── server.js
└── frontend/
    └── src/
        ├── api.js            # Axios instance
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   └── ProtectedRoute.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js
            └── Profile.js
```

---

## ⚙️ Installation

### Prerequisites
- Node.js >= 18
- MySQL running locally

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials
```

### 3. Setup Database
```bash
mysql -u root -p < config/schema.sql
```

### 4. Start Backend
```bash
npm run dev    # development
npm start      # production
```

### 5. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |

### Tasks (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports ?status, ?priority, ?search) |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Users (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update profile |

---

## 🧪 Running Tests
```bash
cd backend
npm test
```

---

## 🌐 Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_manager
JWT_SECRET=your_secret_key
PORT=5000
```
