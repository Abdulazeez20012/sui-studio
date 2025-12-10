import express, { Router, Response, Request } from 'express';

const router: Router = express.Router();

// No authentication required

// Mock data for projects (replace with actual DB later)
const mockProjects: any[] = [];

// No validation - accept any data

// Get all projects - no auth required
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = mockProjects.map(p => ({
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

// Get single project - no auth required
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = mockProjects.find(p => p.id === req.params.id);

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

// Create project - no validation or auth
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body; // Accept any data without validation

    const project = {
      id: `project-${Date.now()}`,
      name: data.name || 'Untitled Project',
      description: data.description || '',
      files: data.files || {},
      isPublic: data.isPublic || false,
      userId: 'anonymous', // No user ID required
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(project);

    res.status(201).json({ project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update project - no validation or auth
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = req.body; // Accept any data without validation

    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);

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
    res.status(500).json({ error: error.message });
  }
});

// Delete project - no auth required
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);

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
