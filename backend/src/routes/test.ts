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
    const { projectId, filter, coverage } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);

    const report = await testRunner.runTests(workspacePath, {
      filter,
      coverage,
    });

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
    const { projectId, testName } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);

    const result = await testRunner.runSingleTest(workspacePath, testName);

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
    const { projectId } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);

    const coverage = await testRunner.getCoverage(workspacePath);

    res.json({
      success: true,
      coverage,
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
    const { projectId } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);

    const tests = await testRunner.listTests(workspacePath);

    res.json({
      success: true,
      tests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
