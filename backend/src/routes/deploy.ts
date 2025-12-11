/**
 * Real Deployment Routes
 * Handles contract deployment to Sui blockchain
 * Note: Actual signing happens on frontend with user's wallet
 */

import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { suiCompiler } from '../services/suiCompiler';

const router: Router = express.Router();
const prisma = new PrismaClient();

router.use(optionalAuth);

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

const prepareDeploySchema = z.object({
  code: z.string(),
  packageName: z.string(),
  network: z.enum(['testnet', 'devnet', 'mainnet']),
  sender: z.string(),
});

const confirmDeploySchema = z.object({
  deploymentId: z.string(),
  transactionDigest: z.string(),
  network: z.enum(['testnet', 'devnet', 'mainnet']),
});

/**
 * Prepare deployment - compile code and return transaction bytes
 * Frontend will sign with wallet and submit
 */
router.post('/prepare', async (req: AuthRequest, res) => {
  try {
    const { code, packageName, network, sender } = prepareDeploySchema.parse(req.body);

    // Step 1: Compile the Move code
    const compileResult = await suiCompiler.compile(code, packageName);

    if (!compileResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Compilation failed',
        errors: compileResult.errors,
      });
    }

    if (!compileResult.modules || compileResult.modules.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No compiled modules found',
      });
    }

    // Step 2: Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        userId: req.userId || 'anonymous',
        projectId: req.body.projectId || 'temp',
        network,
        status: 'pending',
        gasBudget: 100000000,
      },
    });

    // Step 3: Build publish transaction
    const client = new SuiClient({ url: RPC_URLS[network] });
    const tx = new Transaction();

    // Convert base64 modules to number arrays
    const modules = compileResult.modules.map((m) => 
      Array.from(Buffer.from(m, 'base64'))
    );

    // Get dependencies (standard Sui framework)
    const dependencies = [
      '0x1', // Move stdlib
      '0x2', // Sui framework
    ];

    // Add publish command
    const [upgradeCap] = tx.publish({
      modules,
      dependencies,
    });

    // Transfer upgrade capability to sender
    tx.transferObjects([upgradeCap], sender);

    // Set gas budget
    tx.setGasBudget(100000000);
    tx.setSender(sender);

    // Build transaction bytes
    const txBytes = await tx.build({ client });

    res.json({
      success: true,
      deploymentId: deployment.id,
      transactionBytes: Buffer.from(txBytes).toString('base64'),
      modules: compileResult.modules.length,
      gasEstimate: compileResult.gasEstimate,
    });
  } catch (error: any) {
    console.error('Prepare deployment error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Confirm deployment after wallet signs and submits
 */
router.post('/confirm', async (req: AuthRequest, res) => {
  try {
    const { deploymentId, transactionDigest, network } = confirmDeploySchema.parse(req.body);

    // Get transaction details from blockchain
    const client = new SuiClient({ url: RPC_URLS[network] });

    const txDetails = await client.getTransactionBlock({
      digest: transactionDigest,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });

    // Check transaction status
    const status = txDetails.effects?.status.status;
    if (status !== 'success') {
      await prisma.deployment.update({
        where: { id: deploymentId },
        data: {
          status: 'failed',
          errorMessage: JSON.stringify(txDetails.effects?.status.error),
        },
      });

      return res.status(400).json({
        success: false,
        error: 'Transaction failed',
        details: txDetails.effects?.status.error,
      });
    }

    // Extract package ID from object changes
    const publishedPackage = txDetails.objectChanges?.find(
      (change) => change.type === 'published'
    ) as any;

    const packageId = publishedPackage?.packageId;

    // Calculate gas used
    const gasUsed = txDetails.effects?.gasUsed;
    const totalGas = gasUsed
      ? Number(gasUsed.computationCost) + Number(gasUsed.storageCost) - Number(gasUsed.storageRebate)
      : 0;

    // Update deployment record
    const updatedDeployment = await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: 'success',
        packageId,
        transactionDigest,
        gasUsed: totalGas,
      },
    });

    res.json({
      success: true,
      deployment: updatedDeployment,
      packageId,
      transactionDigest,
      gasUsed: totalGas,
      explorerUrl: `https://suiexplorer.com/txblock/${transactionDigest}?network=${network}`,
      packageExplorerUrl: packageId 
        ? `https://suiexplorer.com/object/${packageId}?network=${network}`
        : undefined,
    });
  } catch (error: any) {
    console.error('Confirm deployment error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get deployment status
 */
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const deployment = await prisma.deployment.findFirst({
      where: {
        id: req.params.id,
        ...(req.userId ? { userId: req.userId } : {}),
      },
      include: {
        project: {
          select: { name: true },
        },
      },
    });

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // If pending, check blockchain for status
    if (deployment.status === 'pending' && deployment.transactionDigest) {
      const client = new SuiClient({ url: RPC_URLS[deployment.network] });
      
      try {
        const txDetails = await client.getTransactionBlock({
          digest: deployment.transactionDigest,
          options: { showEffects: true },
        });

        const status = txDetails.effects?.status.status;
        if (status === 'success' || status === 'failure') {
          await prisma.deployment.update({
            where: { id: deployment.id },
            data: { status: status === 'success' ? 'success' : 'failed' },
          });
          deployment.status = status === 'success' ? 'success' : 'failed';
        }
      } catch {
        // Transaction not found yet
      }
    }

    res.json({ deployment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get project deployments
 */
router.get('/project/:projectId', async (req: AuthRequest, res) => {
  try {
    const deployments = await prisma.deployment.findMany({
      where: {
        projectId: req.params.projectId,
        ...(req.userId ? { userId: req.userId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ deployments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user's deployment history
 */
router.get('/history/all', async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const deployments = await prisma.deployment.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        project: {
          select: { name: true },
        },
      },
    });

    res.json({ deployments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Verify deployed package on blockchain
 */
router.get('/verify/:packageId', async (req: AuthRequest, res) => {
  try {
    const { packageId } = req.params;
    const network = (req.query.network as string) || 'testnet';

    const client = new SuiClient({ url: RPC_URLS[network] || RPC_URLS.testnet });

    const packageObj = await client.getObject({
      id: packageId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    if (!packageObj.data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Package not found' 
      });
    }

    // Get normalized modules
    const modules = await client.getNormalizedMoveModulesByPackage({
      package: packageId,
    });

    res.json({
      success: true,
      packageId,
      network,
      modules: Object.keys(modules),
      objectType: packageObj.data.type,
      version: packageObj.data.version,
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Estimate deployment gas
 */
router.post('/estimate-gas', async (req: AuthRequest, res) => {
  try {
    const { code, packageName, network, sender } = prepareDeploySchema.parse(req.body);

    // Compile to get bytecode size
    const compileResult = await suiCompiler.compile(code, packageName);

    if (!compileResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Compilation failed',
        errors: compileResult.errors,
      });
    }

    // Calculate gas estimate based on bytecode size
    const bytecodeSize = compileResult.modules?.reduce(
      (sum, m) => sum + Buffer.from(m, 'base64').length,
      0
    ) || 0;

    // Gas estimation formula (approximate)
    const baseGas = 10000000; // 10M base
    const perByteGas = 100; // 100 per byte
    const estimatedGas = baseGas + bytecodeSize * perByteGas;

    // Try dry run if possible
    let dryRunGas: number | undefined;
    if (sender && compileResult.modules && compileResult.modules.length > 0) {
      try {
        const client = new SuiClient({ url: RPC_URLS[network] });
        const tx = new Transaction();

        const modules = compileResult.modules.map((m) =>
          Array.from(Buffer.from(m, 'base64'))
        );

        const [upgradeCap] = tx.publish({
          modules,
          dependencies: ['0x1', '0x2'],
        });

        tx.transferObjects([upgradeCap], sender);
        tx.setGasBudget(500000000);
        tx.setSender(sender);

        const bytes = await tx.build({ client });
        const dryRun = await client.dryRunTransactionBlock({
          transactionBlock: bytes,
        });

        const gasUsed = dryRun.effects.gasUsed;
        dryRunGas =
          Number(gasUsed.computationCost) +
          Number(gasUsed.storageCost) -
          Number(gasUsed.storageRebate);
      } catch (error) {
        console.error('Dry run failed:', error);
      }
    }

    res.json({
      success: true,
      estimatedGas: dryRunGas || estimatedGas,
      bytecodeSize,
      recommendedBudget: Math.ceil((dryRunGas || estimatedGas) * 1.5),
      breakdown: {
        base: baseGas,
        bytecode: bytecodeSize * perByteGas,
        dryRun: dryRunGas,
      },
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
