import express from 'express';
import { z } from 'zod';
import { zkLoginService } from '../services/zkLogin';

const router = express.Router();

// Validation schemas
const verifyJWTSchema = z.object({
  sessionId: z.string(),
  jwt: z.string(),
  salt: z.string(),
});

const getUserAddressSchema = z.object({
  jwt: z.string(),
  salt: z.string(),
});

const getOAuthUrlSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  nonce: z.string(),
  redirectUri: z.string(),
});

/**
 * POST /api/zklogin/session
 * Create a new zkLogin session
 */
router.post('/session', async (req, res) => {
  try {
    const session = await zkLoginService.createSession();

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error creating zkLogin session:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/zklogin/session/:id
 * Get zkLogin session
 */
router.get('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = zkLoginService.getSession(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error fetching zkLogin session:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/zklogin/verify
 * Verify JWT and generate zkLogin proof
 */
router.post('/verify', async (req, res) => {
  try {
    const { sessionId, jwt, salt } = verifyJWTSchema.parse(req.body);
    const proof = await zkLoginService.verifyJWT(sessionId, jwt, salt);

    res.json({
      success: true,
      data: proof,
    });
  } catch (error: any) {
    console.error('Error verifying JWT:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/zklogin/generate-salt
 * Generate a new salt for zkLogin
 */
router.get('/generate-salt', async (req, res) => {
  try {
    const salt = zkLoginService.generateSalt();

    res.json({
      success: true,
      data: { salt },
    });
  } catch (error: any) {
    console.error('Error generating salt:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/zklogin/user-address
 * Get user address from JWT and salt
 */
router.post('/user-address', async (req, res) => {
  try {
    const { jwt, salt } = getUserAddressSchema.parse(req.body);
    const address = zkLoginService.getUserAddress(jwt, salt);

    res.json({
      success: true,
      data: { address },
    });
  } catch (error: any) {
    console.error('Error getting user address:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/zklogin/oauth-url
 * Get OAuth URL for provider
 */
router.post('/oauth-url', async (req, res) => {
  try {
    const { provider, nonce, redirectUri } = getOAuthUrlSchema.parse(req.body);

    let url: string;
    if (provider === 'google') {
      url = zkLoginService.getGoogleOAuthUrl(nonce, redirectUri);
    } else {
      url = zkLoginService.getFacebookOAuthUrl(nonce, redirectUri);
    }

    res.json({
      success: true,
      data: { url },
    });
  } catch (error: any) {
    console.error('Error getting OAuth URL:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
