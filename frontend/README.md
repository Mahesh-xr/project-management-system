# Frontend - Project Management System Web App

Modern React frontend built with Vite, React Router v6, Context API for authentication state, and Vanilla CSS for styling.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Routing**: React Router DOM
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios with JWT Interceptor
- **Styling**: Vanilla CSS (CSS Grid, Flexbox, Glassmorphism, Google Fonts)

---

## Setup & Running Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The client app will launch at `http://localhost:5173`.

---

## Features
- **Authentication**: JWT token storage in `localStorage` and request interceptor auto-header attachment.
- **Protected Routes**: `<ProtectedRoute>` wrapper preventing unauthorized access.
- **Projects CRUD**: Create, edit, list, and delete projects with search & status filters.
- **Tasks CRUD**: Create, edit, list, delete, and update status/priority across projects.
- **Dashboard**: Real-time summary metrics driven by Prisma database aggregates.
