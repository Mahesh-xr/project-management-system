import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Register a new user
export async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // Hash the password with bcrypt (cost factor 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the User in PostgreSQL
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        passwordHash
      },
      // Exclude passwordHash in output selection for security
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      message: 'Registration successful.',
      user
    });
  } catch (error) {
    next(error);
  }
}

// Login an existing user
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Issue JWT (access token) with 24 hours expiry
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'super_secret_jwt_key_for_interview',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// Logout user
export async function logout(req, res) {
  // JWT is stateless, so logout is mainly handled by the client destroying the token.
  // However, returning a standard 200 message aligns with conventional REST APIs.
  return res.json({ message: 'Logout successful. Please delete your access token.' });
}
