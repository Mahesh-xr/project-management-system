# API Documentation - Project Management System

Base URL: `http://localhost:5000/api`

---

## Authentication Endpoints

### 1. Register User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Auth Required**: No
- **Rate Limited**: Yes (5 requests / 15 min)
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secretpassword"
}
```
- **Response Shape (201 Created)**:
```json
{
  "message": "Registration successful.",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-07-21T15:00:00.000Z"
  }
}
```

### 2. Login User
- **Method**: `POST`
- **Path**: `/auth/login`
- **Auth Required**: No
- **Rate Limited**: Yes (5 requests / 15 min)
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "secretpassword"
}
```
- **Response Shape (200 OK)**:
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-07-21T15:00:00.000Z"
  }
}
```

### 3. Logout User
- **Method**: `POST`
- **Path**: `/auth/logout`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response Shape (200 OK)**:
```json
{
  "message": "Logout successful. Please delete your access token."
}
```

---

## Project Endpoints

All project endpoints require authentication header: `Authorization: Bearer <token>`

### 1. Get All Projects
- **Method**: `GET`
- **Path**: `/projects`
- **Query Params**: `?search=&status=`
- **Response Shape (200 OK)**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Website Redesign",
    "description": "Revamping UI/UX",
    "status": "IN_PROGRESS",
    "startDate": "2026-08-01T00:00:00.000Z",
    "endDate": "2026-09-01T00:00:00.000Z",
    "createdAt": "2026-07-21T15:00:00.000Z"
  }
]
```

### 2. Get Project by ID
- **Method**: `GET`
- **Path**: `/projects/:id`
- **Response Shape (200 OK)**: Includes project details and nested `tasks` array.

### 3. Create Project
- **Method**: `POST`
- **Path**: `/projects`
- **Request Body**:
```json
{
  "name": "New Project",
  "description": "Optional description",
  "status": "NOT_STARTED",
  "startDate": "2026-08-01",
  "endDate": "2026-09-01"
}
```

### 4. Update Project
- **Method**: `PUT`
- **Path**: `/projects/:id`
- **Request Body**: Same as Create Project fields.

### 5. Delete Project
- **Method**: `DELETE`
- **Path**: `/projects/:id`
- **Response Shape (200 OK)**:
```json
{
  "message": "Project and all associated tasks deleted successfully."
}
```

---

## Task Endpoints

All task endpoints require authentication header: `Authorization: Bearer <token>`

### 1. Get All Tasks
- **Method**: `GET`
- **Path**: `/tasks`
- **Query Params**: `?search=&status=&priority=&projectId=`
- **Response Shape (200 OK)**: Array of tasks scoped to user's projects.

### 2. Get Task by ID
- **Method**: `GET`
- **Path**: `/tasks/:id`

### 3. Create Task
- **Method**: `POST`
- **Path**: `/tasks`
- **Request Body**:
```json
{
  "projectId": 1,
  "name": "Design Wireframes",
  "description": "Figma mockups",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2026-08-15"
}
```

### 4. Update Task
- **Method**: `PUT`
- **Path**: `/tasks/:id`

### 5. Delete Task
- **Method**: `DELETE`
- **Path**: `/tasks/:id`

---

## Dashboard Analytics Endpoint

### 1. Get Dashboard Aggregates
- **Method**: `GET`
- **Path**: `/dashboard`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response Shape (200 OK)**:
```json
{
  "totalProjects": 5,
  "totalTasks": 12,
  "projectsNotStarted": 1,
  "projectsInProgress": 3,
  "projectsCompleted": 1,
  "tasksPending": 4,
  "tasksInProgress": 5,
  "tasksCompleted": 3
}
```
