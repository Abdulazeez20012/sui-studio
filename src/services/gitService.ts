import { apiService } from './apiService';

export interface GitStatus {
  modified: string[];
  created: string[];
  deleted: string[];
  renamed: { from: string; to: string }[];
  staged: string[];
  conflicted: string[];
  current: string;
  tracking: string | null;
  ahead: number;
  behind: number;
}

export interface GitBranch {
  name: string;
  current: boolean;
  commit: string;
  label: string;
}

export interface GitCommit {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
}

export interface GitRemote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
}

class GitService {
  private projectId: string | null = null;

  setProjectId(projectId: string) {
    this.projectId = projectId;
  }

  // Initialize repository
  async init(): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/init', {
      projectId: this.projectId,
    });
    return response;
  }

  // Get status
  async status(): Promise<GitStatus | null> {
    const response = await apiService.get(`/git/status?projectId=${this.projectId}`);
    return response.status;
  }

  // Stage files
  async add(files: string[]): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/add', {
      projectId: this.projectId,
      files,
    });
    return response;
  }

  // Unstage files
  async reset(files: string[]): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/reset', {
      projectId: this.projectId,
      files,
    });
    return response;
  }

  // Commit
  async commit(
    message: string,
    author?: { name: string; email: string }
  ): Promise<{ success: boolean; message: string; hash?: string }> {
    const response = await apiService.post('/git/commit', {
      projectId: this.projectId,
      message,
      author,
    });
    return response;
  }

  // Get commit history
  async log(maxCount: number = 50): Promise<GitCommit[]> {
    const response = await apiService.get(
      `/git/log?projectId=${this.projectId}&maxCount=${maxCount}`
    );
    return response.commits || [];
  }

  // Get branches
  async branches(): Promise<GitBranch[]> {
    const response = await apiService.get(`/git/branches?projectId=${this.projectId}`);
    if (!response.branches) return [];
    
    const branches = response.branches;
    return Object.keys(branches.branches).map((name) => ({
      name,
      current: name === branches.current,
      commit: branches.branches[name].commit,
      label: branches.branches[name].label,
    }));
  }

  // Create branch
  async createBranch(branchName: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/branch/create', {
      projectId: this.projectId,
      branchName,
    });
    return response;
  }

  // Checkout branch
  async checkout(branchName: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/checkout', {
      projectId: this.projectId,
      branchName,
    });
    return response;
  }

  // Delete branch
  async deleteBranch(
    branchName: string,
    force: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post(`/git/branch/${branchName}/delete`, {
      projectId: this.projectId,
      force,
    });
    return response;
  }

  // Merge branch
  async merge(branchName: string): Promise<{
    success: boolean;
    message: string;
    conflicts?: string[];
  }> {
    const response = await apiService.post('/git/merge', {
      projectId: this.projectId,
      branchName,
    });
    return response;
  }

  // Get diff
  async diff(options?: { cached?: boolean; file?: string }): Promise<string> {
    const params = new URLSearchParams({
      projectId: this.projectId || '',
      ...(options?.cached && { cached: 'true' }),
      ...(options?.file && { file: options.file }),
    });
    
    const response = await apiService.get(`/git/diff?${params}`);
    return response.diff || '';
  }

  // Add remote
  async addRemote(name: string, url: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/remote/add', {
      projectId: this.projectId,
      name,
      url,
    });
    return response;
  }

  // Get remotes
  async getRemotes(): Promise<GitRemote[]> {
    const response = await apiService.get(`/git/remotes?projectId=${this.projectId}`);
    return response.remotes || [];
  }

  // Pull
  async pull(remote: string = 'origin', branch?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/pull', {
      projectId: this.projectId,
      remote,
      branch,
    });
    return response;
  }

  // Push
  async push(
    remote: string = 'origin',
    branch?: string,
    setUpstream: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/push', {
      projectId: this.projectId,
      remote,
      branch,
      setUpstream,
    });
    return response;
  }

  // Clone
  async clone(url: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/clone', {
      url,
      projectId: this.projectId,
    });
    return response;
  }

  // Stash
  async stash(message?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/stash', {
      projectId: this.projectId,
      message,
    });
    return response;
  }

  // Stash pop
  async stashPop(): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/git/stash/pop', {
      projectId: this.projectId,
    });
    return response;
  }

  // Stash list
  async stashList(): Promise<any[]> {
    const response = await apiService.get(`/git/stash/list?projectId=${this.projectId}`);
    return response.stashes || [];
  }
}

export const gitService = new GitService();
