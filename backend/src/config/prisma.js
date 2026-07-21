import { PrismaClient } from '@prisma/client';

// We initialize a single, shared PrismaClient instance.
// Critical Interview Explainability:
// Creating a new PrismaClient instance on every HTTP request is an anti-pattern because
// each instance opens its own database connection pool. In a high-traffic app, this would
// quickly exhaust the database connections and cause requests to hang or crash.
// By exporting this single instance, we reuse the connection pool across the application.
const prisma = new PrismaClient();

export default prisma;
