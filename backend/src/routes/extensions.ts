import express from 'express';
import { z } from 'zod';
import { extensionsMarketplace } from '../services/extensionsMarketplace';

const router = express.Router();

// Validation schemas
const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional()
});

const installSchema = z.object({
  extensionId: z.string(),
  version: z.string().optional()
});

const toggleSchema = z.object({
  enabled: z.boolean()
});

const settingsSchema = z.object({
  settings: z.record(z.any())
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

/**
 * GET /api/extensions
 * Get all extensions
 */
router.get('/', async (req, res) => {
  try {
    const extensions = await extensionsMarketplace.getExtensions();
    res.json({
      success: true,
      data: extensions,
      total: extensions.length
    });
  } catch (error: any) {
    console.error('Error fetching extensions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/search
 * Search extensions
 */
router.get('/search', async (req, res) => {
  try {
    const { query, category, tags, verified, featured } = searchSchema.parse(req.query);
    const result = await extensionsMarketplace.searchExtensions(query, category, tags, verified, featured);
    
    res.json({
      success: true,
      data: result.extensions,
      total: result.total,
      categories: result.categories
    });
  } catch (error: any) {
    console.error('Error searching extensions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/featured
 * Get featured extensions
 */
router.get('/featured', async (req, res) => {
  try {
    const extensions = await extensionsMarketplace.getFeaturedExtensions();
    res.json({
      success: true,
      data: extensions
    });
  } catch (error: any) {
    console.error('Error fetching featured extensions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/popular
 * Get popular extensions
 */
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const extensions = await extensionsMarketplace.getPopularExtensions(limit);
    res.json({
      success: true,
      data: extensions
    });
  } catch (error: any) {
    console.error('Error fetching popular extensions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/categories
 * Get extension categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await extensionsMarketplace.getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/:id
 * Get extension details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const extension = await extensionsMarketplace.getExtension(id);
    
    if (!extension) {
      return res.status(404).json({
        success: false,
        error: 'Extension not found'
      });
    }

    res.json({
      success: true,
      data: extension
    });
  } catch (error: any) {
    console.error('Error fetching extension:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/user/:userId/installed
 * Get user's installed extensions
 */
router.get('/user/:userId/installed', async (req, res) => {
  try {
    const { userId } = req.params;
    const installations = await extensionsMarketplace.getUserExtensions(userId);
    
    // Get full extension details for each installation
    const extensionsWithDetails = await Promise.all(
      installations.map(async (installation) => {
        const extension = await extensionsMarketplace.getExtension(installation.extensionId);
        return {
          ...installation,
          extension
        };
      })
    );

    res.json({
      success: true,
      data: extensionsWithDetails
    });
  } catch (error: any) {
    console.error('Error fetching user extensions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/extensions/user/:userId/install
 * Install extension for user
 */
router.post('/user/:userId/install', async (req, res) => {
  try {
    const { userId } = req.params;
    const { extensionId, version } = installSchema.parse(req.body);
    
    const installation = await extensionsMarketplace.installExtension(userId, extensionId, version);
    const extension = await extensionsMarketplace.getExtension(extensionId);
    
    res.json({
      success: true,
      data: {
        ...installation,
        extension
      }
    });
  } catch (error: any) {
    console.error('Error installing extension:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/extensions/user/:userId/uninstall/:extensionId
 * Uninstall extension for user
 */
router.delete('/user/:userId/uninstall/:extensionId', async (req, res) => {
  try {
    const { userId, extensionId } = req.params;
    const success = await extensionsMarketplace.uninstallExtension(userId, extensionId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Extension not installed'
      });
    }

    res.json({
      success: true,
      message: 'Extension uninstalled successfully'
    });
  } catch (error: any) {
    console.error('Error uninstalling extension:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PATCH /api/extensions/user/:userId/toggle/:extensionId
 * Toggle extension enabled state
 */
router.patch('/user/:userId/toggle/:extensionId', async (req, res) => {
  try {
    const { userId, extensionId } = req.params;
    const { enabled } = toggleSchema.parse(req.body);
    
    const installation = await extensionsMarketplace.toggleExtension(userId, extensionId, enabled);
    
    if (!installation) {
      return res.status(404).json({
        success: false,
        error: 'Extension not installed'
      });
    }

    res.json({
      success: true,
      data: installation
    });
  } catch (error: any) {
    console.error('Error toggling extension:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/extensions/user/:userId/settings/:extensionId
 * Update extension settings
 */
router.put('/user/:userId/settings/:extensionId', async (req, res) => {
  try {
    const { userId, extensionId } = req.params;
    const { settings } = settingsSchema.parse(req.body);
    
    const installation = await extensionsMarketplace.updateExtensionSettings(userId, extensionId, settings);
    
    if (!installation) {
      return res.status(404).json({
        success: false,
        error: 'Extension not installed'
      });
    }

    res.json({
      success: true,
      data: installation
    });
  } catch (error: any) {
    console.error('Error updating extension settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/extensions/:id/review
 * Submit extension review
 */
router.post('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = reviewSchema.parse(req.body);
    const userId = req.headers['user-id'] as string || 'anonymous';
    
    const success = await extensionsMarketplace.submitReview(id, userId, rating, comment);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Extension not found'
      });
    }

    res.json({
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/extensions/:id/stats
 * Get extension statistics
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await extensionsMarketplace.getExtensionStats(id);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'Extension not found'
      });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching extension stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
