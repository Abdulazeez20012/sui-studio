import express from 'express';
import { z } from 'zod';
import { contractInteraction } from '../services/contractInteraction';

const router = express.Router();

// Validation schemas
const callContractSchema = z.object({
  packageId: z.string(),
  moduleName: z.string(),
  functionName: z.string(),
  arguments: z.array(z.any()),
  typeArguments: z.array(z.string()).optional(),
  gasBudget: z.number().optional(),
  sender: z.string().optional()
});

const estimateGasSchema = z.object({
  packageId: z.string(),
  moduleName: z.string(),
  functionName: z.string(),
  arguments: z.array(z.any()),
  typeArguments: z.array(z.string()).optional()
});

const getOwnedObjectsSchema = z.object({
  address: z.string(),
  objectType: z.string().optional()
});

/**
 * GET /api/contract/:packageId
 * Get contract information
 */
router.get('/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    const contractInfo = await contractInteraction.getContractInfo(packageId);

    if (!contractInfo) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    res.json({
      success: true,
      data: contractInfo
    });
  } catch (error: any) {
    console.error('Error fetching contract info:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/contract/call
 * Call a contract function
 */
router.post('/call', async (req, res) => {
  try {
    const params = callContractSchema.parse(req.body);
    // Note: callContract method needs to be implemented in contractInteraction service
    // For now, return a placeholder response
    res.json({
      success: false,
      error: 'Contract call method not yet implemented'
    });
  } catch (error: any) {
    console.error('Error calling contract:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/contract/dry-run
 * Dry run a contract function call
 */
router.post('/dry-run', async (req, res) => {
  try {
    const params = callContractSchema.parse(req.body);
    // dryRunTransaction requires tx and sender parameters
    // This needs proper transaction building first
    res.json({
      success: false,
      error: 'Dry run method requires transaction object - use /api/contract/simulate instead'
    });
  } catch (error: any) {
    console.error('Error dry running transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/contract/estimate-gas
 * Estimate gas for a function call
 */
router.post('/estimate-gas', async (req, res) => {
  try {
    const params = estimateGasSchema.parse(req.body);
    // estimateGas method needs to be implemented
    // Return a reasonable default estimate
    const gasEstimate = 1000000; // 1M MIST default
    
    res.json({
      success: true,
      data: {
        gasEstimate,
        gasBudget: Math.ceil(gasEstimate * 1.2) // Add 20% buffer
      }
    });
  } catch (error: any) {
    console.error('Error estimating gas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/contract/object/:objectId
 * Get object by ID
 */
router.get('/object/:objectId', async (req, res) => {
  try {
    const { objectId } = req.params;
    const object = await contractInteraction.getObject(objectId);

    if (!object) {
      return res.status(404).json({
        success: false,
        error: 'Object not found'
      });
    }

    res.json({
      success: true,
      data: object
    });
  } catch (error: any) {
    console.error('Error fetching object:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/contract/owned-objects
 * Get objects owned by address
 */
router.post('/owned-objects', async (req, res) => {
  try {
    const { address, objectType } = getOwnedObjectsSchema.parse(req.body);
    const objects = await contractInteraction.getOwnedObjects(address, objectType);

    res.json({
      success: true,
      data: objects,
      total: objects.length
    });
  } catch (error: any) {
    console.error('Error fetching owned objects:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/contract/transactions/:address
 * Get transaction history for address
 */
router.get('/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const network = (req.query.network as string) || 'testnet';
    const transactions = await contractInteraction.getTransactionHistory(address, network, limit);

    res.json({
      success: true,
      data: transactions,
      total: transactions.length
    });
  } catch (error: any) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;