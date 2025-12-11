import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { testRunner } from '../services/testRunner';
import { z } from 'zod';
import path from 'path';

const router = express.Router();

// Apply authentication
router.use(authenticateToken);

// Helper to get workspace path
const getWorkspacePath = (userId: string, projectId?: string): string => {
  const baseWorkspace = path.join(process.cwd(), 'workspaces', userId);
  return projectId ? path.join(baseWorkspace, projectId) : baseWorkspace;
};

// Run all tests
router.post('/run', async (req: AuthRequest, res) => {
  try {
    const { projectId, filter, coverage, code, packageName } = req.body;
    
    // For now, use code from request body
    const report = await testRunner.runTests(
      code || 'module test::example { }',
      packageName || 'test_package',
      {
        filter,
        coverage,
      }
    );

    res.json({
      success: true,
      report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Run single test
router.post('/run-single', async (req: AuthRequest, res) => {
  try {
    const { code, testName, packageName } = req.body;

    const result = await testRunner.runSingleTest(
      code || 'module test::example { }',
      testName,
      packageName || 'test_package'
    );

    res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get coverage
router.get('/coverage', async (req: AuthRequest, res) => {
  try {
    const { code, packageName } = req.query;

    const report = await testRunner.runTests(
      (code as string) || 'module test::example { }',
      (packageName as string) || 'test_package',
      { coverage: true }
    );

    res.json({
      success: true,
      coverage: report.coverage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// List tests
router.get('/list', async (req: AuthRequest, res) => {
  try {
    // For now, return empty array - would need to parse code to extract test functions
    res.json({
      success: true,
      tests: [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
