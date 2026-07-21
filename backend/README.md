# Backend - Project Management System API

Express.js REST API with Node native ES Modules, Prisma ORM, PostgreSQL database, and JWT authentication.

## Tech Stack
- **Runtime & Server**: Node.js + Express.js (ES Modules)
- **Database ORM**: Prisma ORM with PostgreSQL
- **Security**: JWT (Bearer tokens), bcrypt password hashing, express-validator, express-rate-limit

---

## Setup & Running Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Setup
Copy the example `.env` file and set your credentials:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` matches your local PostgreSQL connection parameters:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_management_db?schema=public"
JWT_SECRET="super_secret_jwt_key_for_interview"
```

### 3. Run Database Migrations
Generate PostgreSQL schema tables and client bindings using Prisma:
```bash
npx prisma migrate dev --name init
```

### 4. Start Development Server
```bash
npm run dev
```
The server will start listening at `http://localhost:5000`.

---

## Key Technical Decisions for Interview

1. **Native ES Modules (`"type": "module"`)**: Uses standard ESM syntax throughout (`import`/`export`) and explicit `.js` extensions on local imports per Node ESM specs.
2. **Prisma Client Singleton**: `config/prisma.js` exports a single shared instance to avoid exhausting database connection pools.
3. **Data Isolation & Scoped Queries**: Every project/task query checks user ownership (`where: { userId: req.userId }`).
4. **Aggregations at Database Level**: Dashboard stats are computed using Prisma's native `count()` and `groupBy()` rather than loading records into JavaScript memory.
5. **Cascading Deletes**: `onDelete: Cascade` in `schema.prisma` automatically removes tasks when their parent project or user is deleted.
