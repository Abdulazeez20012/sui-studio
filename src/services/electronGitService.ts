import { GitStatus, GitBranch, GitCommit } from './gitService';

class ElectronGitService {
  private executeGitCommand = async (command: string, cwd: string): Promise<string> => {
    if (!window.electron?.isElectron) {
      throw new Error('Not running in Electron');
    }

    const result = await window.electron.executeCommand(`git ${command}`, cwd);
    
    if (!result.success) {
      throw new Error(result.error || 'Git command failed');
    }

    return result.output;
  };

  // Check if directory is a git repository
  async isGitRepo(cwd: string): Promise<boolean> {
    try {
      await this.executeGitCommand('rev-parse --git-dir', cwd);
      return true;
    } catch {
      return false;
    }
  }

  // Initialize repository
  async init(cwd: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.executeGitCommand('init', cwd);
      return { success: true, message: 'Repository initialized' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get status
  async status(cwd: string): Promise<GitStatus | null> {
    try {
      const output = await this.executeGitCommand('status --porcelain --branch', cwd);
      return this.parseStatus(output);
    } catch (error) {
      console.error('Git status error:', error);
      return null;
    }
  }

  private parseStatus(output: string): GitStatus {
    const lines = output.split('\n').filter(l => l.trim());
    const status: GitStatus = {
      modified: [],
      created: [],
      deleted: [],
      renamed: [],
      staged: [],
      conflicted: [],
      current: 'main',
      tracking: null,
      ahead: 0,
      behind: 0,
    };

    for (const line of lines) {
      if (line.startsWith('##')) {
        // Branch info
        const branchMatch = line.match(/## ([^\s.]+)/);
        if (branchMatch) {
          status.current = branchMatch[1];
        }
        const trackingMatch = line.match(/\.\.\.([^\s]+)/);
        if (trackingMatch) {
          status.tracking = trackingMatch[1];
        }
        const aheadMatch = line.match(/ahead (\d+)/);
        if (aheadMatch) {
          status.ahead = parseInt(aheadMatch[1]);
        }
        const behindMatch = line.match(/behind (\d+)/);
        if (behindMatch) {
          status.behind = parseInt(behindMatch[1]);
        }
      } else {
        const statusCode = line.substring(0, 2);
        const file = line.substring(3);

        // Staged changes (first character)
        if (statusCode[0] !== ' ' && statusCode[0] !== '?') {
          status.staged.push(file);
        }

        // Parse status codes
        if (statusCode.includes('M')) status.modified.push(file);
        if (statusCode.includes('A')) status.created.push(file);
        if (statusCode.includes('D')) status.deleted.push(file);
        if (statusCode.includes('U')) status.conflicted.push(file);
        if (statusCode.includes('R')) {
          const parts = file.split(' -> ');
          if (parts.length === 2) {
            status.renamed.push({ from: parts[0], to: parts[1] });
          }
        }
      }
    }

    return status;
  }

  // Stage files
  async add(files: string[], cwd: string): Promise<{ success: boolean; message: string }> {
    try {
      const fileList = files.map(f => `"${f}"`).join(' ');
      await this.executeGitCommand(`add ${fileList}`, cwd);
      return { success: true, message: 'Files staged' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Unstage files
  async reset(files: string[], cwd: string): Promise<{ success: boolean; message: string }> {
    try {
      const fileList = files.map(f => `"${f}"`).join(' ');
      await this.executeGitCommand(`reset HEAD ${fileList}`, cwd);
      return { success: true, message: 'Files unstaged' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Commit
  async commit(message: string, cwd: string): Promise<{ success: boolean; message: string; hash?: string }> {
    try {
      const output = await this.executeGitCommand(`commit -m "${message}"`, cwd);
      const hashMatch = output.match(/\[.+\s+([a-f0-9]+)\]/);
      return {
        success: true,
        message: 'Committed successfully',
        hash: hashMatch ? hashMatch[1] : undefined,
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Get commit history
  async log(maxCount: number, cwd: string): Promise<GitCommit[]> {
    try {
      const output = await this.executeGitCommand(
        `log --pretty=format:"%H|%an|%ae|%ad|%s" --date=iso -n ${maxCount}`,
        cwd
      );
      
      return output.split('\n').filter(l => l.trim()).map(line => {
        const [hash, author_name, author_email, date, message] = line.split('|');
        return {
          hash,
          author_name,
          author_email,
          date,
          message,
        };
      });
    } catch (error) {
      console.error('Git log error:', error);
      return [];
    }
  }

  // Get branches
  async branches(cwd: string): Promise<GitBranch[]> {
    try {
      const output = await this.executeGitCommand('branch -v', cwd);
      
      return output.split('\n').filter(l => l.trim()).map(line => {
        const current = line.startsWith('*');
        const parts = line.replace('*', '').trim().split(/\s+/);
        return {
          name: parts[0],
          current,
          commit: parts[1] || '',
          label: parts.slice(2).join(' '),
        };
      });
    } catch (error) {
      console.error('Git branches error:', error);
      return [];
    }
  }

  // Create branch
  async createBranch(branchName: string, cwd: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.executeGitCommand(`branch ${branchName}`, cwd);
      return { success: true, message: `Branch '${branchName}' created` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Checkout branch
  async checkout(branchName: string, cwd: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.executeGitCommand(`checkout ${branchName}`, cwd);
      return { success: true, message: `Switched to branch '${branchName}'` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Pull
  async pull(cwd: string, remote: string = 'origin', branch?: string): Promise<{ success: boolean; message: string }> {
    try {
      const cmd = branch ? `pull ${remote} ${branch}` : `pull ${remote}`;
      const output = await this.executeGitCommand(cmd, cwd);
      return { success: true, message: output || 'Pulled successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Push
  async push(cwd: string, remote: string = 'origin', branch?: string): Promise<{ success: boolean; message: string }> {
    try {
      const cmd = branch ? `push ${remote} ${branch}` : `push ${remote}`;
      const output = await this.executeGitCommand(cmd, cwd);
      return { success: true, message: output || 'Pushed successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

export const electronGitService = new ElectronGitService();
