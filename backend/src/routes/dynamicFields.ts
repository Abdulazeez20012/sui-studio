import express from 'express';
import { z } from 'zod';
import { dynamicFieldsService } from '../services/dynamicFields';

const router = express.Router();

// Validation schemas
const getFieldsSchema = z.object({
  objectId: z.string(),
  network: z.string().optional().default('testnet'),
});

const getFieldValueSchema = z.object({
  objectId: z.string(),
  fieldName: z.any(),
  network: z.string().optional().default('testnet'),
});

const getFieldTreeSchema = z.object({
  objectId: z.string(),
  network: z.string().optional().default('testnet'),
  maxDepth: z.number().optional().default(3),
});

const searchFieldsSchema = z.object({
  objectId: z.string(),
  searchTerm: z.string(),
  network: z.string().optional().default('testnet'),
});

/**
 * POST /api/dynamic-fields/get
 * Get all dynamic fields for an object
 */
router.post('/get', async (req, res) => {
  try {
    const { objectId, network } = getFieldsSchema.parse(req.body);
    const fields = await dynamicFieldsService.getDynamicFields(objectId, network);

    res.json({
      success: true,
      data: fields,
    });
  } catch (error: any) {
    console.error('Error getting dynamic fields:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/dynamic-fields/get-value
 * Get dynamic field value
 */
router.post('/get-value', async (req, res) => {
  try {
    const { objectId, fieldName, network } = getFieldValueSchema.parse(req.body);
    const value = await dynamicFieldsService.getDynamicFieldValue(objectId, fieldName, network);

    res.json({
      success: true,
      data: value,
    });
  } catch (error: any) {
    console.error('Error getting field value:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/dynamic-fields/get-tree
 * Get dynamic field tree (recursive)
 */
router.post('/get-tree', async (req, res) => {
  try {
    const { objectId, network, maxDepth } = getFieldTreeSchema.parse(req.body);
    const tree = await dynamicFieldsService.getDynamicFieldTree(objectId, network, maxDepth);

    res.json({
      success: true,
      data: tree,
    });
  } catch (error: any) {
    console.error('Error getting field tree:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/dynamic-fields/search
 * Search dynamic fields by name
 */
router.post('/search', async (req, res) => {
  try {
    const { objectId, searchTerm, network } = searchFieldsSchema.parse(req.body);
    const fields = await dynamicFieldsService.searchDynamicFields(objectId, searchTerm, network);

    res.json({
      success: true,
      data: fields,
    });
  } catch (error: any) {
    console.error('Error searching fields:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/dynamic-fields/export
 * Export dynamic fields as JSON
 */
router.post('/export', async (req, res) => {
  try {
    const { objectId, network } = getFieldsSchema.parse(req.body);
    const json = await dynamicFieldsService.exportDynamicFields(objectId, network);

    res.json({
      success: true,
      data: { json },
    });
  } catch (error: any) {
    console.error('Error exporting fields:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
