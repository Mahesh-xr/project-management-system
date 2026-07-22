import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/index.js';
import authRateLimiter from '../middleware/rateLimiter.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
// Applies rate limiting and validation checks before invoking the registration controller.
router.post('/register', registerValidator, register);

// POST /api/auth/login
// Applies rate limiting and validation checks before checking credentials.
router.post('/login', authRateLimiter, loginValidator, login);

// POST /api/auth/logout
// Protected route to confirm JWT validity before logging out (for REST consistency).
router.post('/logout', authMiddleware, logout);

export default router;
