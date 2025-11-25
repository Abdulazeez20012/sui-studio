import express, { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router: Router = express.Router();

router.use(authenticateToken);

// Mock data for extensions (replace with actual DB later)
const mockExtensions = [
  {
    id: 'move-analyzer',
    userId: 'user-1',
    extensionId: 'move-analyzer',
    enabled: true,
    installedAt: new Date(),
    extension: {
      id: 'move-analyzer',
      name: 'Move Analyzer',
      description: 'Static analysis for Move code',
      version: '1.0.0',
      downloads: 1250,
    },
  },
];

// Get user's installed extensions
router.get('/installed', async (req: AuthRequest, res: Response) => {
  try {
    // Return mock data for now
    const extensions = mockExtensions.filter(ext => ext.userId === req.userId);
    res.json({ extensions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Install extension
router.post('/install', async (req: AuthRequest, res: Response) => {
  try {
    const { extensionId } = z.object({
      extensionId: z.string(),
    }).parse(req.body);

    // Check if already installed
    const existing = mockExtensions.find(
      ext => ext.userId === req.userId && ext.extensionId === extensionId
    );

    if (existing) {
      return res.json({ message: 'Extension already installed', extension: existing });
    }

    // Mock installation
    const newExtension = {
      id: `ext-${Date.now()}`,
      userId: req.userId!,
      extensionId,
      enabled: true,
      installedAt: new Date(),
      extension: {
        id: extensionId,
        name: extensionId,
        description: 'Extension description',
        version: '1.0.0',
        downloads: 0,
      },
    };

    mockExtensions.push(newExtension);

    res.json({ message: 'Extension installed successfully', extension: newExtension });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Uninstall extension
router.delete('/uninstall/:extensionId', async (req: AuthRequest, res: Response) => {
  try {
    const index = mockExtensions.findIndex(
      ext => ext.userId === req.userId && ext.extensionId === req.params.extensionId
    );

    if (index !== -1) {
      mockExtensions.splice(index, 1);
    }

    res.json({ message: 'Extension uninstalled successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle extension enabled state
router.patch('/toggle/:extensionId', async (req: AuthRequest, res: Response) => {
  try {
    const { enabled } = z.object({
      enabled: z.boolean(),
    }).parse(req.body);

    const extension = mockExtensions.find(
      ext => ext.userId === req.userId && ext.extensionId === req.params.extensionId
    );

    if (extension) {
      extension.enabled = enabled;
      res.json({ extension });
    } else {
      res.status(404).json({ error: 'Extension not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
