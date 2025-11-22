import { FileNode } from '../types/ide';

interface Project {
  id: string;
  name: string;
  files: FileNode[];
  lastModified: Date;
  userId: string;
}

class CloudStorageService {
  private storageKey = 'sui-studio-projects';

  // Save project to cloud (localStorage for now, can be upgraded to real backend)
  async saveProject(projectName: string, files: FileNode[], userId: string): Promise<boolean> {
    try {
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.name === projectName && p.userId === userId);
      
      const project: Project = {
        id: existingIndex >= 0 ? projects[existingIndex].id : `proj-${Date.now()}`,
        name: projectName,
        files,
        lastModified: new Date(),
        userId,
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      return false;
    }
  }

  // Load user's projects
  getUserProjects(userId: string): Project[] {
    const projects = this.getAllProjects();
    return projects.filter(p => p.userId === userId);
  }

  // Get specific project
  getProject(projectId: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  // Delete project
  deleteProject(projectId: string): boolean {
    try {
      const projects = this.getAllProjects();
      const filtered = projects.filter(p => p.id !== projectId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  }

  // Auto-save current work
  async autoSave(files: FileNode[], userId: string): Promise<void> {
    const autoSaveKey = `autosave-${userId}`;
    try {
      localStorage.setItem(autoSaveKey, JSON.stringify({
        files,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  // Restore auto-saved work
  restoreAutoSave(userId: string): FileNode[] | null {
    const autoSaveKey = `autosave-${userId}`;
    try {
      const data = localStorage.getItem(autoSaveKey);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.files;
      }
    } catch (error) {
      console.error('Failed to restore auto-save:', error);
    }
    return null;
  }

  private getAllProjects(): Project[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }
}

export const cloudStorageService = new CloudStorageService();
