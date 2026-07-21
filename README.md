# Project Management System

A modern full-stack **Project Management System** built with **React**, **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. The application enables users to securely manage projects and tasks through an intuitive interface while following a clean MVC architecture and industry-standard security practices.

Designed with simplicity and maintainability in mind, this project demonstrates core full-stack development concepts including authentication, RESTful APIs, database relationships, and responsive frontend development.

---

## ✨ Features

* Secure user authentication with JWT
* Password hashing using bcrypt
* Complete Project CRUD operations
* Complete Task CRUD operations
* Dashboard with real-time project and task statistics
* Search and filter functionality
* Protected routes for authenticated users
* Form validation on both client and server
* Responsive user interface
* Centralized error handling
* Rate limiting for authentication endpoints

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Context API
* Axios
* CSS3 (Flexbox & Grid)

### Backend

* Node.js
* Express.js (ES Modules)
* Prisma ORM
* PostgreSQL
* JSON Web Tokens (JWT)
* bcrypt
* express-validator
* express-rate-limit

---

## 📂 Project Structure

```text
project-management-system/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* PostgreSQL
* npm

### Clone the Repository

```bash
git clone https://github.com/Mahesh-xr/project-management-system.git
cd project-management-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/project_management"
JWT_SECRET="your_secret_key"
PORT=5000
```

Run Prisma migrations and generate the client.

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend server.

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Security

* JWT-based Authentication
* Password Hashing with bcrypt
* Request Validation using express-validator
* Rate Limiting for Authentication APIs
* Protected API Routes
* Prisma ORM (Parameterized Queries)
* Centralized Error Handling

---

## 📡 API Overview

| Method | Endpoint             | Description           |
| :----- | :------------------- | :-------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Authenticate user     |
| POST   | `/api/auth/logout`   | Logout user           |
| GET    | `/api/projects`      | Retrieve all projects |
| POST   | `/api/projects`      | Create a project      |
| PUT    | `/api/projects/:id`  | Update a project      |
| DELETE | `/api/projects/:id`  | Delete a project      |
| GET    | `/api/tasks`         | Retrieve all tasks    |
| POST   | `/api/tasks`         | Create a task         |
| PUT    | `/api/tasks/:id`     | Update a task         |
| DELETE | `/api/tasks/:id`     | Delete a task         |
| GET    | `/api/dashboard`     | Dashboard analytics   |

---

## 📈 Key Highlights

* Clean MVC architecture
* Native ES Modules (ESM)
* Relational database design with Prisma ORM
* Secure authentication and authorization
* Search and filtering using Prisma queries
* Dashboard analytics using Prisma aggregations
* Responsive and user-friendly interface

---

## 🌱 Future Enhancements

* Team collaboration
* File attachments
* Email notifications
* Activity tracking
* Refresh token authentication
* Dark mode support

---

## 👨‍💻 Author

**Maheshkumar K**

Final Year B.E. Computer Science and Engineering
Rajalakshmi Institute of Technology

---

⭐ If you found this project helpful, consider giving it a star on GitHub.
