import express from 'express';
import { z } from 'zod';
import { packageManager } from '../services/packageManager';

const router = express.Router();

// Validation schemas
const searchSchema = z.object({
  query: z.string().optional().default(''),
  category: z.string().optional()
});

const installSchema = z.object({
  packageName: z.string(),
  projectPath: z.string().optional().default('/tmp/sui-project')
});

const generateTomlSchema = z.object({
  projectName: z.string(),
  packages: z.array(z.string())
});

/**
 * GET /api/packages
 * Get all available packages
 */
router.get('/', async (req, res) => {
  try {
    const packages = await packageManager.searchPackages('');
    res.json({
      success: true,
      data: packages,
      total: packages.length
    });
  } catch (error: any) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/packages/search
 * Search packages
 */
router.get('/search', async (req, res) => {
  try {
    const { query, category } = searchSchema.parse(req.query);
    const packages = await packageManager.searchPackages(query);
    
    res.json({
      success: true,
      data: packages,
      total: packages.length
    });
  } catch (error: any) {
    console.error('Error searching packages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/packages/categories
 * Get all package categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = ['Framework', 'DeFi', 'NFT', 'Gaming', 'Utility', 'Oracle'];
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
 * GET /api/packages/:name
 * Get package details
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const pkg = await packageManager.getPackageInfo(name);
    
    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: pkg
    });
  } catch (error: any) {
    console.error('Error fetching package details:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/packages/install
 * Install a package
 */
router.post('/install', async (req, res) => {
  try {
    const { packageName, projectPath } = installSchema.parse(req.body);
    const result = await packageManager.installPackage(packageName, projectPath);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error installing package:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/packages/uninstall
 * Uninstall a package
 */
router.post('/uninstall', async (req, res) => {
  try {
    const { packageName, projectPath } = installSchema.parse(req.body);
    const result = await packageManager.uninstallPackage(packageName, projectPath);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error uninstalling package:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/packages/generate-toml
 * Generate Move.toml with selected packages
 */
router.post('/generate-toml', async (req, res) => {
  try {
    const { projectName, packages: packageNames } = generateTomlSchema.parse(req.body);
    
    // Get package details
    const packages = await Promise.all(
      packageNames.map(name => packageManager.getPackageInfo(name))
    );
    
    const validPackages = packages.filter(p => p !== null);
    
    // Generate Move.toml content
    let toml = `[package]\nname = "${projectName}"\nversion = "0.0.1"\nedition = "2024.beta"\n\n[dependencies]\n`;
    for (const pkg of validPackages) {
      if (pkg && pkg.source.type === 'git') {
        toml += `${pkg.name} = { git = "${pkg.source.url}", rev = "${pkg.source.rev || 'main'}"`;
        if (pkg.source.subdir) {
          toml += `, subdir = "${pkg.source.subdir}"`;
        }
        toml += ' }\n';
      }
    }
    toml += `\n[addresses]\n${projectName} = "0x0"\n`;
    
    res.json({
      success: true,
      data: {
        toml,
        packages: validPackages
      }
    });
  } catch (error: any) {
    console.error('Error generating Move.toml:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/packages/:name/verify
 * Verify package integrity
 */
router.get('/:name/verify', async (req, res) => {
  try {
    const { name } = req.params;
    const pkg = await packageManager.getPackageInfo(name);
    
    res.json({
      success: true,
      data: {
        package: name,
        verified: pkg !== null
      }
    });
  } catch (error: any) {
    console.error('Error verifying package:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
