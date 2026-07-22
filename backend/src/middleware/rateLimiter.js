import rateLimit from 'express-rate-limit';

// Rate limiting middleware.
// Limits clients to 5 authentication requests (login/register) per 15 minutes.
// This prevents brute-force password guessing and server denial-of-service.
const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes window
  max: 300,                   // Limit each IP to 5 requests per window
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,    // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,     // Disable the `X-RateLimit-*` headers
});

export default authRateLimiter;
