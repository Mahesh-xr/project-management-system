// Centralized error-handling middleware.
// This captures all runtime exceptions thrown inside controllers or async route handlers,
// log them for debugging, and returns a consistent JSON payload { error: message } to the client.
export default function errorHandler(err, req, res, next) {
  console.error('[Error Handler Log]:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message
  });
}
