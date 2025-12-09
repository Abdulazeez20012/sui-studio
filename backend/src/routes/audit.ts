import express from 'express';
import { z } from 'zod';
import { securityAuditor } from '../services/securityAuditor';

const router = express.Router();

const auditSchema = z.object({
  code: z.string().min(1, 'Code is required')
});

/**
 * POST /api/audit
 * Perform security audit on code
 */
router.post('/', async (req, res) => {
  try {
    const { code } = auditSchema.parse(req.body);
    
    console.log('Starting security audit...');
    const report = await securityAuditor.auditCode(code);

    res.json({
      success: true,
      data: report
    });
  } catch (error: any) {
    console.error('Error performing audit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/audit/:id
 * Get audit report by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = securityAuditor.getAudit(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Audit report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error: any) {
    console.error('Error fetching audit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/audit/:id/export
 * Export audit report
 */
router.get('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const json = securityAuditor.exportReport(id);

    res.json({
      success: true,
      data: { json }
    });
  } catch (error: any) {
    console.error('Error exporting audit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
