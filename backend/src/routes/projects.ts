import express, { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Mock data for projects (replace with actual DB later)
const mockProjects: any[] = [];

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
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const projects = mockProjects
      .filter(p => p.userId === req.userId)
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        isPublic: p.isPublic,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        _count: {
          deployments: 0,
        },
      }));

    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const project = mockProjects.find(
      p => p.id === req.params.id && (p.userId === req.userId || p.isPublic)
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ 
      project: {
        ...project,
        deployments: [],
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = {
      id: `project-${Date.now()}`,
      ...data,
      userId: req.userId!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(project);

    res.status(201).json({ project });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = updateProjectSchema.parse(req.body);

    // Check ownership
    const projectIndex = mockProjects.findIndex(
      p => p.id === req.params.id && p.userId === req.userId
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...data,
      updatedAt: new Date(),
    };

    res.json({ project: mockProjects[projectIndex] });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    // Check ownership
    const projectIndex = mockProjects.findIndex(
      p => p.id === req.params.id && p.userId === req.userId
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    mockProjects.splice(projectIndex, 1);

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
