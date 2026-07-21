import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Route Handlers
// Critical ESM Rule: Relative imports MUST have explicit file extensions (.js)
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Import Dashboard Controller directly
import { getDashboardStats } from './controllers/dashboardController.js';

// Import Middlewares
import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (Cross-Origin Resource Sharing)
// Allows frontend running on different port (Vite on 5173) to communicate with API

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ismo-task-tracker.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON requests body
app.use(express.json());

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// GET /api/dashboard - Scoped Dashboard Aggregates endpoint
// Requires valid JWT validation via authMiddleware
app.get('/api/dashboard', authMiddleware, getDashboardStats);

// Centralized error handler.
// This must be placed after all other route configurations to intercept all exceptions.
app.use(errorHandler);

// Start the Express Server
app.listen(PORT, () => {
  console.log(`[Server running]: Listening on port ${PORT}`);
  console.log(`[Environment]: ${process.env.NODE_ENV || 'development'}`);
});
