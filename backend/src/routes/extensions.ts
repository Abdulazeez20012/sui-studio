import express, { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router: Router = express.Router();

// Mock Prisma client for now - will be replaced with actual DB
const prisma = {
  userExtension: {
    findMany: async () => [],
    findFirst: async () => null,
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (params: any) => ({ id: params.where.id, ...params.data }),
    delete: async () => ({ id: 'mock-id' }),
  },
};

router.use(authenticateToken);

// Get user's installed extensions
router.get('/installed', async (req: AuthRequest, res) => {
  try {
    const extensions = await prisma.userExtension.findMany({
      where: { userId: req.userId! },
      include: {
        extension: true,
      },
      orderBy: { installedAt: 'desc' },
    });

    res.json({ extensions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Install extension
router.post('/install', async (req: AuthRequest, res) => {
  try {
    const { extensionId } = z.object({
      extensionId: z.string(),
    }).parse(req.body);

    // Check if already installed
    const existing = await prisma.userExtension.findUnique({
      where: {
        userId_extensionId: {
          userId: req.userId!,
          extensionId,
        },
      },
    });

    if (existing) {
      return res.json({ message: 'Extension already installed', extension: existing });
    }

    // Install extension
    const userExtension = await prisma.userExtension.create({
      data: {
        userId: req.userId!,
        extensionId,
        enabled: true,
      },
      include: {
        extension: true,
      },
    });

    // Increment download count
    await prisma.extension.update({
      where: { id: extensionId },
      data: {
        downloads: { increment: 1 },
      },
    });

    res.json({ message: 'Extension installed successfully', extension: userExtension });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Uninstall extension
router.delete('/uninstall/:extensionId', async (req: AuthRequest, res) => {
  try {
    await prisma.userExtension.delete({
      where: {
        userId_extensionId: {
          userId: req.userId!,
          extensionId: req.params.extensionId,
        },
      },
    });

    res.json({ message: 'Extension uninstalled successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle extension enabled state
router.patch('/toggle/:extensionId', async (req: AuthRequest, res) => {
  try {
    const { enabled } = z.object({
      enabled: z.boolean(),
    }).parse(req.body);

    const userExtension = await prisma.userExtension.update({
      where: {
        userId_extensionId: {
          userId: req.userId!,
          extensionId: req.params.extensionId,
        },
      },
      data: { enabled },
    });

    res.json({ extension: userExtension });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
