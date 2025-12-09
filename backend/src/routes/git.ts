import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { gitService } from '../services/gitService';
import { z } from 'zod';
import path from 'path';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Helper to get workspace path
const getWorkspacePath = (userId: string, projectId?: string): string => {
  const baseWorkspace = path.join(process.cwd(), 'workspaces', userId);
  return projectId ? path.join(baseWorkspace, projectId) : baseWorkspace;
};

// Initialize repository
router.post('/init', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.init(workspacePath);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get status
router.get('/status', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);
    
    const status = await gitService.status(workspacePath);
    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stage files
router.post('/add', async (req: AuthRequest, res) => {
  try {
    const { projectId, files } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.add(workspacePath, files);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unstage files
router.post('/reset', async (req: AuthRequest, res) => {
  try {
    const { projectId, files } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.reset(workspacePath, files);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Commit
router.post('/commit', async (req: AuthRequest, res) => {
  try {
    const { projectId, message, author } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.commit(workspacePath, message, author);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get commit history
router.get('/log', async (req: AuthRequest, res) => {
  try {
    const { projectId, maxCount } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);
    
    const log = await gitService.log(workspacePath, maxCount ? parseInt(maxCount as string) : 50);
    res.json({ success: true, commits: log });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get branches
router.get('/branches', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);
    
    const branches = await gitService.branches(workspacePath);
    res.json({ success: true, branches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create branch
router.post('/branch/create', async (req: AuthRequest, res) => {
  try {
    const { projectId, branchName } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.createBranch(workspacePath, branchName);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Checkout branch
router.post('/checkout', async (req: AuthRequest, res) => {
  try {
    const { projectId, branchName } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.checkout(workspacePath, branchName);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete branch
router.delete('/branch/:branchName', async (req: AuthRequest, res) => {
  try {
    const { branchName } = req.params;
    const { projectId, force } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.deleteBranch(workspacePath, branchName, force);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Merge branch
router.post('/merge', async (req: AuthRequest, res) => {
  try {
    const { projectId, branchName } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.merge(workspacePath, branchName);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get diff
router.get('/diff', async (req: AuthRequest, res) => {
  try {
    const { projectId, cached, file } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);
    
    const diff = await gitService.diff(workspacePath, {
      cached: cached === 'true',
      file: file as string,
    });
    
    res.json({ success: true, diff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add remote
router.post('/remote/add', async (req: AuthRequest, res) => {
  try {
    const { projectId, name, url } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.addRemote(workspacePath, name, url);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get remotes
router.get('/remotes', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);
    
    const remotes = await gitService.getRemotes(workspacePath);
    res.json({ success: true, remotes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pull
router.post('/pull', async (req: AuthRequest, res) => {
  try {
    const { projectId, remote, branch } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.pull(workspacePath, remote, branch);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Push
router.post('/push', async (req: AuthRequest, res) => {
  try {
    const { projectId, remote, branch, setUpstream } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.push(workspacePath, remote, branch, setUpstream);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clone
router.post('/clone', async (req: AuthRequest, res) => {
  try {
    const { url, projectId } = req.body;
    const targetPath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.clone(url, targetPath);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stash
router.post('/stash', async (req: AuthRequest, res) => {
  try {
    const { projectId, message } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.stash(workspacePath, message);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stash pop
router.post('/stash/pop', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.body;
    const workspacePath = getWorkspacePath(req.userId!, projectId);
    
    const result = await gitService.stashPop(workspacePath);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stash list
router.get('/stash/list', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query;
    const workspacePath = getWorkspacePath(req.userId!, projectId as string);
    
    const stashes = await gitService.stashList(workspacePath);
    res.json({ success: true, stashes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
