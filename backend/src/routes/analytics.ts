import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Track endpoint should be public (optional auth)
router.post('/track', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { event, metadata } = req.body;

    // Log analytics event (in production, send to analytics service)
    console.log('Analytics Event:', {
      userId: req.userId,
      event,
      metadata,
      timestamp: new Date(),
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Other routes require authentication
router.use(authenticateToken);

// Get user analytics
router.get('/user', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Get project count
    const projectCount = await prisma.project.count({
      where: { userId },
    });

    // Get deployment stats
    const deployments = await prisma.deployment.findMany({
      where: { userId },
      select: {
        status: true,
        gasUsed: true,
        createdAt: true,
      },
    });

    const successfulDeployments = deployments.filter(d => d.status === 'success').length;
    const failedDeployments = deployments.filter(d => d.status === 'failed').length;
    const totalGasUsed = deployments.reduce((sum, d) => sum + (d.gasUsed || 0), 0);

    // Get compilation stats
    const compilations = await prisma.compilationCache.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    // Get activity timeline (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = await prisma.deployment.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const activityByDay = recentActivity.reduce((acc, item) => {
      const day = item.createdAt.toISOString().split('T')[0];
      if (!acc[day]) acc[day] = 0;
      acc[day]++;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      projects: projectCount,
      deployments: {
        total: deployments.length,
        successful: successfulDeployments,
        failed: failedDeployments,
        successRate: deployments.length > 0 
          ? Math.round((successfulDeployments / deployments.length) * 100) 
          : 0,
      },
      gas: {
        totalUsed: totalGasUsed,
        averagePerDeployment: deployments.length > 0 
          ? Math.round(totalGasUsed / deployments.length) 
          : 0,
      },
      compilations: {
        last30Days: compilations,
      },
      activity: activityByDay,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get project analytics
router.get('/project/:projectId', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    // Verify ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId!,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get deployment history
    const deployments = await prisma.deployment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Calculate metrics
    const totalDeployments = deployments.length;
    const successfulDeployments = deployments.filter(d => d.status === 'success').length;
    const totalGasUsed = deployments.reduce((sum, d) => sum + (d.gasUsed || 0), 0);

    // Get network distribution
    const networkDistribution = deployments.reduce((acc, d) => {
      acc[d.network] = (acc[d.network] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      project: {
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
      },
      deployments: {
        total: totalDeployments,
        successful: successfulDeployments,
        failed: totalDeployments - successfulDeployments,
        successRate: totalDeployments > 0 
          ? Math.round((successfulDeployments / totalDeployments) * 100) 
          : 0,
      },
      gas: {
        total: totalGasUsed,
        average: totalDeployments > 0 ? Math.round(totalGasUsed / totalDeployments) : 0,
      },
      networks: networkDistribution,
      recentDeployments: deployments.slice(0, 5),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
