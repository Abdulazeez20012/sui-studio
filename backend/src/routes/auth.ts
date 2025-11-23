import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const googleAuthSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
  googleId: z.string(),
});

// Google OAuth login/signup
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture, googleId } = googleAuthSchema.parse(req.body);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          picture,
          googleId,
        },
      });
    } else {
      // Update user info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          picture,
          googleId,
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error: any) {
    console.error('Auth error:', error);
    res.status(400).json({ error: error.message || 'Authentication failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
