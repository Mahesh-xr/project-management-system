import jwt from 'jsonwebtoken';

// JWT verification middleware.
// This intercepts requests to protected routes, decodes the token from the Authorization header,
// and appends the verified user's ID (`req.userId`) to the request object.
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Format should be: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Extract token from Bearer prefix
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_for_interview');
    
    // Attach the user's ID to the request object.
    // Downstream controllers can access this to query resources owned strictly by this user.
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
