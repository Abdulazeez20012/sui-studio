import simpleGit, { SimpleGit, StatusResult, BranchSummary, DiffResult } from 'simple-git';
import path from 'path';
import fs from 'fs/promises';

export class GitService {
  private getGit(workspacePath: string): SimpleGit {
    return simpleGit(workspacePath);
  }

  // Initialize a new Git repository
  async init(workspacePath: string): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.init();
      
      // Create initial .gitignore
      const gitignorePath = path.join(workspacePath, '.gitignore');
      const gitignoreContent = `node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
`;
      await fs.writeFile(gitignorePath, gitignoreContent);
      
      return { success: true, message: 'Git repository initialized' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get repository status
  async status(workspacePath: string): Promise<StatusResult | null> {
    try {
      const git = this.getGit(workspacePath);
      return await git.status();
    } catch (error) {
      return null;
    }
  }

  // Stage files
  async add(workspacePath: string, files: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.add(files);
      return { success: true, message: `Staged ${files.length} file(s)` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Unstage files
  async reset(workspacePath: string, files: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.reset(files);
      return { success: true, message: `Unstaged ${files.length} file(s)` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Commit changes
  async commit(
    workspacePath: string,
    message: string,
    author?: { name: string; email: string }
  ): Promise<{ success: boolean; message: string; hash?: string }> {
    try {
      const git = this.getGit(workspacePath);
      
      // Set author if provided
      if (author) {
        await git.addConfig('user.name', author.name);
        await git.addConfig('user.email', author.email);
      }
      
      const result = await git.commit(message);
      return {
        success: true,
        message: 'Committed successfully',
        hash: result.commit,
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get commit history
  async log(workspacePath: string, maxCount: number = 50): Promise<any[]> {
    try {
      const git = this.getGit(workspacePath);
      const log = await git.log({ maxCount });
      return [...log.all];
    } catch (error) {
      return [];
    }
  }

  // Get branches
  async branches(workspacePath: string): Promise<BranchSummary | null> {
    try {
      const git = this.getGit(workspacePath);
      return await git.branch();
    } catch (error) {
      return null;
    }
  }

  // Create new branch
  async createBranch(
    workspacePath: string,
    branchName: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.checkoutLocalBranch(branchName);
      return { success: true, message: `Created and switched to branch '${branchName}'` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Switch branch
  async checkout(
    workspacePath: string,
    branchName: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.checkout(branchName);
      return { success: true, message: `Switched to branch '${branchName}'` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Delete branch
  async deleteBranch(
    workspacePath: string,
    branchName: string,
    force: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.deleteLocalBranch(branchName, force);
      return { success: true, message: `Deleted branch '${branchName}'` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Merge branch
  async merge(
    workspacePath: string,
    branchName: string
  ): Promise<{ success: boolean; message: string; conflicts?: string[] }> {
    try {
      const git = this.getGit(workspacePath);
      const result = await git.merge([branchName]);
      
      if (result.conflicts && result.conflicts.length > 0) {
        return {
          success: false,
          message: 'Merge conflicts detected',
          conflicts: result.conflicts.map(c => c.file),
        };
      }
      
      return { success: true, message: `Merged '${branchName}' successfully` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get diff
  async diff(
    workspacePath: string,
    options?: { cached?: boolean; file?: string }
  ): Promise<string> {
    try {
      const git = this.getGit(workspacePath);
      const args: string[] = [];
      
      if (options?.cached) {
        args.push('--cached');
      }
      
      if (options?.file) {
        args.push(options.file);
      }
      
      return await git.diff(args);
    } catch (error) {
      return '';
    }
  }

  // Add remote
  async addRemote(
    workspacePath: string,
    name: string,
    url: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.addRemote(name, url);
      return { success: true, message: `Added remote '${name}'` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get remotes
  async getRemotes(workspacePath: string): Promise<Array<{ name: string; refs: any }>> {
    try {
      const git = this.getGit(workspacePath);
      return await git.getRemotes(true);
    } catch (error) {
      return [];
    }
  }

  // Pull from remote
  async pull(
    workspacePath: string,
    remote: string = 'origin',
    branch?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.pull(remote, branch);
      return { success: true, message: 'Pulled successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Push to remote
  async push(
    workspacePath: string,
    remote: string = 'origin',
    branch?: string,
    setUpstream: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      const options: string[] = [];
      
      if (setUpstream) {
        options.push('--set-upstream');
      }
      
      await git.push(remote, branch, options);
      return { success: true, message: 'Pushed successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Clone repository
  async clone(
    url: string,
    targetPath: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await simpleGit().clone(url, targetPath);
      return { success: true, message: 'Cloned successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get file content at specific commit
  async show(
    workspacePath: string,
    commitHash: string,
    filePath: string
  ): Promise<string> {
    try {
      const git = this.getGit(workspacePath);
      return await git.show([`${commitHash}:${filePath}`]);
    } catch (error) {
      return '';
    }
  }

  // Stash changes
  async stash(
    workspacePath: string,
    message?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.stash(['push', ...(message ? ['-m', message] : [])]);
      return { success: true, message: 'Changes stashed' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Apply stash
  async stashPop(workspacePath: string): Promise<{ success: boolean; message: string }> {
    try {
      const git = this.getGit(workspacePath);
      await git.stash(['pop']);
      return { success: true, message: 'Stash applied' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // List stashes
  async stashList(workspacePath: string): Promise<any[]> {
    try {
      const git = this.getGit(workspacePath);
      const result = await git.stashList();
      return [...result.all];
    } catch (error) {
      return [];
    }
  }
}

export const gitService = new GitService();
