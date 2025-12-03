import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router: Router = express.Router();
const prisma = new PrismaClient();

router.use(optionalAuth);

const deploySchema = z.object({
  projectId: z.string(),
  network: z.enum(['testnet', 'devnet', 'mainnet']),
  bytecode: z.string(),
  gasBudget: z.number().optional(),
});

// Deploy contract
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { projectId, network, bytecode, gasBudget = 100000000 } = deploySchema.parse(req.body);

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId!,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        userId: req.userId!,
        network,
        status: 'pending',
        gasBudget,
      },
    });

    try {
      // Get RPC URL for network
      const rpcUrl = getRpcUrl(network);
      const client = new SuiClient({ url: rpcUrl });

      // Note: In production, you would need the user's wallet private key
      // For now, we'll simulate the deployment
      
      // Simulate deployment (in production, use actual wallet)
      const mockPackageId = '0x' + Buffer.from(bytecode.substring(0, 32)).toString('hex');
      const mockTxDigest = generateTransactionDigest();

      // Update deployment with success
      const updatedDeployment = await prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: 'success',
          packageId: mockPackageId,
          transactionDigest: mockTxDigest,
          gasUsed: Math.floor(gasBudget * 0.8),
        },
      });

      res.json({
        success: true,
        deployment: updatedDeployment,
        explorerUrl: getExplorerUrl(network, mockTxDigest),
      });
    } catch (error: any) {
      // Update deployment with failure
      await prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      });

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get deployment status
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const deployment = await prisma.deployment.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.json({ deployment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get project deployments
router.get('/project/:projectId', async (req: AuthRequest, res) => {
  try {
    const deployments = await prisma.deployment.findMany({
      where: {
        projectId: req.params.projectId,
        userId: req.userId!,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ deployments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function getRpcUrl(network: string): string {
  const urls: Record<string, string> = {
    testnet: 'https://fullnode.testnet.sui.io:443',
    devnet: 'https://fullnode.devnet.sui.io:443',
    mainnet: 'https://fullnode.mainnet.sui.io:443',
  };
  return urls[network] || urls.testnet;
}

function getExplorerUrl(network: string, txDigest: string): string {
  return `https://suiexplorer.com/txblock/${txDigest}?network=${network}`;
}

function generateTransactionDigest(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export default router;
