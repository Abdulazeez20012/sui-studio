import express from 'express';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

// Get network info
router.get('/network/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const rpcUrl = getRpcUrl(network);
    
    const connection = new Connection({ fullnode: rpcUrl });
    const provider = new JsonRpcProvider(connection);

    const chainId = await provider.getChainIdentifier();
    const latestCheckpoint = await provider.getLatestCheckpointSequenceNumber();

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
    const connection = new Connection({ fullnode: rpcUrl });
    const provider = new JsonRpcProvider(connection);

    const transaction = await provider.getTransactionBlock({
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
    const connection = new Connection({ fullnode: rpcUrl });
    const provider = new JsonRpcProvider(connection);

    const object = await provider.getObject({
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
    
    const connection = new Connection({ fullnode: rpcUrl });
    const provider = new JsonRpcProvider(connection);

    const gasPrice = await provider.getReferenceGasPrice();

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
