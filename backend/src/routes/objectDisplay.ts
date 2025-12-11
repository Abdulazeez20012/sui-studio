import express from 'express';
import { z } from 'zod';
import { objectDisplayService } from '../services/objectDisplay';

const router = express.Router();

// Validation schemas
const getDisplaySchema = z.object({
  objectId: z.string(),
  network: z.string().optional().default('testnet'),
});

const getMultipleDisplaysSchema = z.object({
  objectIds: z.array(z.string()),
  network: z.string().optional().default('testnet'),
});

const renderTemplateSchema = z.object({
  objectId: z.string(),
  template: z.string(),
  network: z.string().optional().default('testnet'),
});

/**
 * POST /api/object-display/get
 * Get object display metadata
 */
router.post('/get', async (req, res) => {
  try {
    const { objectId, network } = getDisplaySchema.parse(req.body);
    const display = await objectDisplayService.getObjectDisplay(objectId, network);

    res.json({
      success: true,
      data: display,
    });
  } catch (error: any) {
    console.error('Error getting object display:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/object-display/get-multiple
 * Get multiple object displays
 */
router.post('/get-multiple', async (req, res) => {
  try {
    const { objectIds, network } = getMultipleDisplaysSchema.parse(req.body);
    const displays = await objectDisplayService.getMultipleObjectDisplays(objectIds, network);

    res.json({
      success: true,
      data: displays,
    });
  } catch (error: any) {
    console.error('Error getting multiple displays:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/object-display/nft-preview
 * Get NFT preview data
 */
router.post('/nft-preview', async (req, res) => {
  try {
    const { objectId, network } = getDisplaySchema.parse(req.body);
    const preview = await objectDisplayService.getNFTPreview(objectId, network);

    res.json({
      success: true,
      data: preview,
    });
  } catch (error: any) {
    console.error('Error getting NFT preview:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/object-display/render-template
 * Render display template
 */
router.post('/render-template', async (req, res) => {
  try {
    const { objectId, template, network } = renderTemplateSchema.parse(req.body);
    const display = await objectDisplayService.getObjectDisplay(objectId, network);
    const rendered = objectDisplayService.renderDisplayTemplate(display.display, template);

    res.json({
      success: true,
      data: { rendered },
    });
  } catch (error: any) {
    console.error('Error rendering template:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/object-display/resolve-image-url
 * Resolve IPFS URL to HTTP
 */
router.post('/resolve-image-url', async (req, res) => {
  try {
    const { url } = req.body;
    const resolved = objectDisplayService.resolveImageUrl(url);

    res.json({
      success: true,
      data: { url: resolved },
    });
  } catch (error: any) {
    console.error('Error resolving image URL:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/object-display/clear-cache
 * Clear display cache
 */
router.post('/clear-cache', async (req, res) => {
  try {
    const { network } = req.body;
    
    if (network) {
      objectDisplayService.clearNetworkCache(network);
    } else {
      objectDisplayService.clearCache();
    }

    res.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
