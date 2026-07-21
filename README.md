# Project Management System

A full-stack **Project Management System** built using **React, Node.js, Express, PostgreSQL, and Prisma ORM**. The application allows users to securely manage projects and tasks with JWT authentication, dashboard analytics, search, and filtering.

The project was intentionally designed with a **simple MVC architecture** so every part of the codebase is easy to understand and explain during technical interviews.

---

# Features

## User Authentication

* User Registration
* User Login
* User Logout
* Password hashing using bcrypt
* JWT-based authentication
* Protected API routes

## Project Management

* Create Project
* View All Projects
* View Single Project
* Update Project
* Delete Project
* Search Projects
* Filter Projects by Status

## Task Management

* Create Task
* View Tasks
* Update Task
* Delete Task
* Search Tasks
* Filter by Status
* Filter by Priority

## Dashboard

Displays project statistics using Prisma aggregation:

* Total Projects
* Total Tasks
* Completed Tasks
* Pending Tasks
* Projects In Progress

The dashboard uses Prisma's `count()` and `groupBy()` methods instead of counting records in JavaScript.

---

# Tech Stack

## Frontend

* React (Vite)
* React Router
* Context API
* Axios
* CSS (Flexbox & Grid)

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt
* express-validator
* express-rate-limit

---

# Project Structure

```
Project-Management-System
│
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── migrations
│   │
│   ├── src
│   │
│   ├── config
│   │     prisma.js
│   │
│   ├── controllers
│   │     authController.js
│   │     projectController.js
│   │     taskController.js
│   │
│   ├── middleware
│   │     auth.js
│   │     errorHandler.js
│   │     rateLimiter.js
│   │
│   ├── routes
│   │     authRoutes.js
│   │     projectRoutes.js
│   │     taskRoutes.js
│   │
│   ├── validators
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── src
│   │
│   ├── api
│   ├── components
│   ├── context
│   ├── pages
│   │
│   ├── App.jsx
│   └── package.json
│
└── README.md
```

---

# Database Design

The application contains three main tables.

## User

Stores application users.

| Field         | Type            |
| ------------- | --------------- |
| id            | Integer         |
| full_name     | String          |
| email         | String (Unique) |
| password_hash | String          |
| created_at    | DateTime        |

Relationship:

```
One User
     │
     └──────► Many Projects
```

---

## Project

Stores projects created by users.

| Field       | Type     |
| ----------- | -------- |
| id          | Integer  |
| user_id     | Integer  |
| name        | String   |
| description | String   |
| status      | Enum     |
| start_date  | Date     |
| end_date    | Date     |
| created_at  | DateTime |

Relationship:

```
Project
   │
   └────► Many Tasks
```

---

## Task

Stores tasks belonging to projects.

| Field       | Type     |
| ----------- | -------- |
| id          | Integer  |
| project_id  | Integer  |
| name        | String   |
| description | String   |
| priority    | Enum     |
| status      | Enum     |
| due_date    | Date     |
| created_at  | DateTime |

---

# Entity Relationship

```
User
│
├── id
├── full_name
├── email
└── password_hash
        │
        │ 1
        │
        ▼
     Project
        │
        ├── id
        ├── name
        ├── status
        └── user_id
              │
              │ 1
              ▼
            Task
            │
            ├── id
            ├── name
            ├── priority
            ├── status
            └── project_id
```

---

# Authentication Flow

```
Register
     │
     ▼
Password hashed using bcrypt
     │
     ▼
Stored in PostgreSQL
```

```
Login
     │
     ▼
Email + Password
     │
     ▼
bcrypt.compare()
     │
     ▼
JWT Token Generated
     │
     ▼
Client Stores Token
     │
     ▼
Token Sent in Authorization Header
     │
     ▼
Protected Routes Verified
```

---

# Dashboard Analytics

The dashboard retrieves statistics directly from the database using Prisma aggregates.

* Total Projects
* Total Tasks
* Completed Tasks
* Pending Tasks
* Projects In Progress

This approach is more efficient because counting is performed by PostgreSQL instead of loading all records into memory.

---

# Search & Filtering

Projects support:

* Search by Name
* Filter by Status

Example:

```
GET /api/projects?search=website&status=IN_PROGRESS
```

Tasks support:

* Search
* Status Filter
* Priority Filter

Example:

```
GET /api/tasks?search=login&status=PENDING&priority=HIGH
```

---

# Security Features

The application includes several security measures.

### Password Hashing

Passwords are hashed using **bcrypt** with a cost factor of **10** before storing them in the database.

---

### JWT Authentication

All project and task APIs require a valid JWT access token.

---

### Request Validation

Incoming request data is validated using **express-validator**.

Validation includes:

* Required fields
* Email format
* Enum validation
* Date validation

---

### Rate Limiting

Authentication routes are protected with **express-rate-limit**.

```
Maximum:
5 Requests

Time Window:
15 Minutes
```

This helps reduce brute-force login attempts.

---

### SQL Injection Protection

The application uses Prisma ORM.

Prisma automatically parameterizes queries, preventing SQL injection attacks without requiring manual escaping.

---

### Password Protection

The `password_hash` field is never returned in API responses.

Prisma `select` statements explicitly exclude it.

---

### Centralized Error Handling

Every error passes through a single middleware.

All errors follow the same JSON format.

```json
{
  "error": "Error message"
}
```

---

# API Endpoints

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| POST   | /api/auth/logout   |

---

## Projects

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/projects     |
| POST   | /api/projects     |
| GET    | /api/projects/:id |
| PUT    | /api/projects/:id |
| DELETE | /api/projects/:id |

---

## Tasks

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/tasks     |
| POST   | /api/tasks     |
| GET    | /api/tasks/:id |
| PUT    | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Dashboard

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/dashboard |

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>

cd Project-Management-System
```

---

## 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/project_management"

JWT_SECRET=your_secret_key

PORT=5000
```

Run Prisma migrations.

```bash
npx prisma migrate dev
```

Generate Prisma Client.

```bash
npx prisma generate
```

Start the backend server.

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Future Improvements

* Refresh Tokens
* File Attachments
* User Profile Management
* Team Collaboration
* Comments on Tasks
* Email Notifications
* Activity Logs
* Dark Mode
* Task Deadlines with Notifications

---

# Learning Objectives

This project demonstrates practical knowledge of:

* React fundamentals
* React Router
* Context API
* REST API development
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Password Hashing
* Route Protection
* CRUD Operations
* MVC Architecture
* Search & Filtering
* Prisma Aggregation
* Secure Backend Development

---

# Author

**Maheshkumar K**

Final Year B.E. Computer Science and Engineering

Rajalakshmi Institute of Technology
