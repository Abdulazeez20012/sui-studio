import express from 'express';
import { SuiClient } from '@mysten/sui/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

// Get network info
router.get('/network/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const rpcUrl = getRpcUrl(network);
    
    const client = new SuiClient({ url: rpcUrl });

    const chainId = await client.getChainIdentifier();
    const latestCheckpoint = await client.getLatestCheckpointSequenceNumber();

    res.json({
      network,
      chainId,
      latestCheckpoint,
      rpcUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction details
router.get('/transaction/:digest', async (req, res) => {
  try {
    const { digest } = req.params;
    const network = req.query.network as string || 'testnet';
    
    const rpcUrl = getRpcUrl(network);
    const client = new SuiClient({ url: rpcUrl });

    const transaction = await client.getTransactionBlock({
      digest,
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
      },
    });

    res.json({ transaction });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get object details
router.get('/object/:objectId', async (req, res) => {
  try {
    const { objectId } = req.params;
    const network = req.query.network as string || 'testnet';
    
    const rpcUrl = getRpcUrl(network);
    const client = new SuiClient({ url: rpcUrl });

    const object = await client.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });

    res.json({ object });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get gas price
router.get('/gas-price/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const rpcUrl = getRpcUrl(network);
    
    const client = new SuiClient({ url: rpcUrl });

    const gasPrice = await client.getReferenceGasPrice();

    res.json({
      network,
      gasPrice: gasPrice.toString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

function getRpcUrl(network: string): string {
  const urls: Record<string, string> = {
    testnet: 'https://fullnode.testnet.sui.io:443',
    devnet: 'https://fullnode.devnet.sui.io:443',
    mainnet: 'https://fullnode.mainnet.sui.io:443',
  };
  return urls[network] || urls.testnet;
}

export default router;
