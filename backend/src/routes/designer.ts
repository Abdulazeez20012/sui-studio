import express from 'express';
import { z } from 'zod';
import { systemDesigner } from '../services/systemDesigner';

const router = express.Router();

// Validation schemas
const createDesignSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

const updateDesignSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  components: z.array(z.any()).optional()
});

const componentSchema = z.object({
  type: z.enum(['module', 'object', 'resource', 'capability', 'function']),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  connections: z.array(z.string()).default([]),
  properties: z.record(z.any()).optional()
});

const updateComponentSchema = z.object({
  type: z.enum(['module', 'object', 'resource', 'capability', 'function']).optional(),
  name: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  connections: z.array(z.string()).optional(),
  properties: z.record(z.any()).optional()
});

const connectionSchema = z.object({
  fromId: z.string(),
  toId: z.string()
});

const generateCodeSchema = z.object({
  moduleName: z.string().optional(),
  includeComments: z.boolean().optional(),
  includeTests: z.boolean().optional()
});

/**
 * POST /api/designer/design
 * Create a new design
 */
router.post('/design', async (req, res) => {
  try {
    const { name, description } = createDesignSchema.parse(req.body);
    const design = systemDesigner.createDesign(name, description);

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error creating design:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/designer/design/:id
 * Get design by ID
 */
router.get('/design/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const design = systemDesigner.getDesign(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error fetching design:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/designer/design/:id
 * Update design
 */
router.put('/design/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = updateDesignSchema.parse(req.body);
    const design = systemDesigner.updateDesign(id, updates);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error updating design:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/designer/design/:id/component
 * Add component to design
 */
router.post('/design/:id/component', async (req, res) => {
  try {
    const { id } = req.params;
    const component = componentSchema.parse(req.body);
    const design = systemDesigner.addComponent(id, component as any);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error adding component:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/designer/design/:designId/component/:componentId
 * Update component
 */
router.put('/design/:designId/component/:componentId', async (req, res) => {
  try {
    const { designId, componentId } = req.params;
    const updates = updateComponentSchema.parse(req.body);
    const design = systemDesigner.updateComponent(designId, componentId, updates as any);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design or component not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error updating component:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/designer/design/:designId/component/:componentId
 * Remove component
 */
router.delete('/design/:designId/component/:componentId', async (req, res) => {
  try {
    const { designId, componentId } = req.params;
    const design = systemDesigner.removeComponent(designId, componentId);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design or component not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error removing component:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/designer/design/:id/connection
 * Add connection between components
 */
router.post('/design/:id/connection', async (req, res) => {
  try {
    const { id } = req.params;
    const { fromId, toId } = connectionSchema.parse(req.body);
    const design = systemDesigner.addConnection(id, fromId, toId);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error adding connection:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/designer/design/:id/connection
 * Remove connection
 */
router.delete('/design/:id/connection', async (req, res) => {
  try {
    const { id } = req.params;
    const { fromId, toId } = connectionSchema.parse(req.body);
    const design = systemDesigner.removeConnection(id, fromId, toId);

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error removing connection:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/designer/design/:id/generate-code
 * Generate Move code from design
 */
router.post('/design/:id/generate-code', async (req, res) => {
  try {
    const { id } = req.params;
    const options = generateCodeSchema.parse(req.body);
    const code = systemDesigner.generateMoveCode(id, options);

    res.json({
      success: true,
      data: { code }
    });
  } catch (error: any) {
    console.error('Error generating code:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/designer/design/:id/mermaid
 * Generate Mermaid diagram
 */
router.get('/design/:id/mermaid', async (req, res) => {
  try {
    const { id } = req.params;
    const diagram = systemDesigner.generateMermaidDiagram(id);

    res.json({
      success: true,
      data: { diagram }
    });
  } catch (error: any) {
    console.error('Error generating Mermaid diagram:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/designer/design/:id/plantuml
 * Generate PlantUML diagram
 */
router.get('/design/:id/plantuml', async (req, res) => {
  try {
    const { id } = req.params;
    const diagram = systemDesigner.generatePlantUMLDiagram(id);

    res.json({
      success: true,
      data: { diagram }
    });
  } catch (error: any) {
    console.error('Error generating PlantUML diagram:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/designer/design/:id/validate
 * Validate design
 */
router.get('/design/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = systemDesigner.validateDesign(id);

    res.json({
      success: true,
      data: validation
    });
  } catch (error: any) {
    console.error('Error validating design:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/designer/design/:id/export
 * Export design as JSON
 */
router.get('/design/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const json = systemDesigner.exportDesign(id);

    res.json({
      success: true,
      data: { json }
    });
  } catch (error: any) {
    console.error('Error exporting design:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/designer/import
 * Import design from JSON
 */
router.post('/import', async (req, res) => {
  try {
    const { json } = req.body;
    const design = systemDesigner.importDesign(json);

    res.json({
      success: true,
      data: design
    });
  } catch (error: any) {
    console.error('Error importing design:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
