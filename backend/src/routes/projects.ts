import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  files: z.any(), // JSON structure
  isPublic: z.boolean().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  files: z.any().optional(),
  isPublic: z.boolean().optional(),
});

// Get all user projects
router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId! },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { deployments: true },
        },
      },
    });

    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { userId: req.userId! },
          { isPublic: true },
        ],
      },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        ...data,
        userId: req.userId!,
      },
    });

    res.status(201).json({ project });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = updateProjectSchema.parse(req.body);

    // Check ownership
    const existing = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ project });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    // Check ownership
    const existing = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
