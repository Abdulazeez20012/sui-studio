import { useState, useCallback } from 'react';
import { FileNode } from '../types/ide';

interface ElectronAPI {
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  readDirectory: (dirPath: string) => Promise<{ success: boolean; files?: any[]; error?: string }>;
  createDirectory: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
  deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
  showSaveDialog: (options: any) => Promise<{ canceled: boolean; filePath?: string }>;
  renameFile: (oldPath: string, newPath: string) => Promise<{ success: boolean; error?: string }>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export const useElectronFileSystem = () => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isElectron = typeof window !== 'undefined' && window.electron?.isElectron;

  // Open folder dialog and load files
  const openFolder = useCallback(async (): Promise<FileNode[] | null> => {
    if (!isElectron || !window.electron) {
      console.warn('Not running in Electron environment');
      return null;
    }

    try {
      setIsLoading(true);
      const result = await window.electron.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Open Project Folder',
      });

      if (result.canceled || !result.filePaths[0]) {
        return null;
      }

      const folderPath = result.filePaths[0];
      setCurrentFolder(folderPath);

      // Load folder contents recursively
      const files = await loadFolderRecursive(folderPath, folderPath);
      
      // Save to recent projects
      saveToRecentProjects(folderPath);
      
      return files;
    } catch (error: any) {
      console.error('Failed to open folder:', error);
      throw new Error(`Failed to open folder: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  // Load folder contents recursively
  const loadFolderRecursive = async (
    dirPath: string,
    rootPath: string,
    depth: number = 0
  ): Promise<FileNode[]> => {
    if (!window.electron || depth > 10) return []; // Prevent infinite recursion

    try {
      const result = await window.electron.readDirectory(dirPath);
      
      if (!result.success || !result.files) {
        console.error('Failed to read directory:', result.error);
        return [];
      }

      const nodes: FileNode[] = [];

      for (const entry of result.files) {
        // Skip hidden files and common ignore patterns
        if (shouldIgnoreFile(entry.name)) {
          continue;
        }

        const relativePath = entry.path.replace(rootPath, '');
        
        if (entry.isDirectory) {
          const children = await loadFolderRecursive(entry.path, rootPath, depth + 1);
          nodes.push({
            id: entry.path,
            name: entry.name,
            type: 'folder',
            path: relativePath || '/',
            children,
          });
        } else {
          // Determine language from extension
          const language = getLanguageFromExtension(entry.name);
          
          nodes.push({
            id: entry.path,
            name: entry.name,
            type: 'file',
            path: relativePath,
            language,
            // Don't load content yet - load on demand
          });
        }
      }

      return nodes.sort((a, b) => {
        // Folders first, then alphabetically
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error loading folder:', error);
      return [];
    }
  };

  // Read file content
  const readFile = useCallback(async (filePath: string): Promise<string | null> => {
    if (!isElectron || !window.electron || !currentFolder) {
      return null;
    }

    try {
      const fullPath = currentFolder + filePath;
      const result = await window.electron.readFile(fullPath);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to read file');
      }
      
      return result.content || '';
    } catch (error: any) {
      console.error('Failed to read file:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }, [isElectron, currentFolder]);

  // Write file content
  const writeFile = useCallback(async (filePath: string, content: string): Promise<boolean> => {
    if (!isElectron || !window.electron || !currentFolder) {
      return false;
    }

    try {
      const fullPath = currentFolder + filePath;
      const result = await window.electron.writeFile(fullPath, content);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to write file');
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to write file:', error);
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }, [isElectron, currentFolder]);

  // Create new file
  const createFile = useCallback(async (filePath: string, content: string = ''): Promise<boolean> => {
    return writeFile(filePath, content);
  }, [writeFile]);

  // Create new directory
  const createDirectory = useCallback(async (dirPath: string): Promise<boolean> => {
    if (!isElectron || !window.electron || !currentFolder) {
      return false;
    }

    try {
      const fullPath = currentFolder + dirPath;
      const result = await window.electron.createDirectory(fullPath);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create directory');
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to create directory:', error);
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }, [isElectron, currentFolder]);

  // Delete file or directory
  const deleteFile = useCallback(async (filePath: string): Promise<boolean> => {
    if (!isElectron || !window.electron || !currentFolder) {
      return false;
    }

    try {
      const fullPath = currentFolder + filePath;
      const result = await window.electron.deleteFile(fullPath);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete');
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to delete:', error);
      throw new Error(`Failed to delete: ${error.message}`);
    }
  }, [isElectron, currentFolder]);

  // Save to recent projects
  const saveToRecentProjects = (folderPath: string) => {
    try {
      const recent = localStorage.getItem('recentProjects');
      const projects = recent ? JSON.parse(recent) : [];
      
      // Add to beginning, remove duplicates, keep last 10
      const updated = [
        folderPath,
        ...projects.filter((p: string) => p !== folderPath)
      ].slice(0, 10);
      
      localStorage.setItem('recentProjects', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent project:', error);
    }
  };

  // Rename file or directory
  const renameFile = useCallback(async (oldPath: string, newPath: string): Promise<boolean> => {
    if (!isElectron || !window.electron || !currentFolder) {
      return false;
    }

    try {
      const fullOldPath = currentFolder + oldPath;
      const fullNewPath = currentFolder + newPath;
      const result = await window.electron.renameFile(fullOldPath, fullNewPath);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to rename');
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to rename:', error);
      throw new Error(`Failed to rename: ${error.message}`);
    }
  }, [isElectron, currentFolder]);

  // Get recent projects
  const getRecentProjects = useCallback((): string[] => {
    try {
      const recent = localStorage.getItem('recentProjects');
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Failed to get recent projects:', error);
      return [];
    }
  }, []);

  return {
    isElectron,
    currentFolder,
    isLoading,
    openFolder,
    readFile,
    writeFile,
    createFile,
    createDirectory,
    deleteFile,
    renameFile,
    getRecentProjects,
  };
};

// Helper functions
function shouldIgnoreFile(name: string): boolean {
  const ignorePatterns = [
    /^\./,           // Hidden files
    /^node_modules$/,
    /^\.git$/,
    /^\.vscode$/,
    /^\.idea$/,
    /^dist$/,
    /^build$/,
    /^target$/,
    /^\.DS_Store$/,
    /^Thumbs\.db$/,
  ];

  return ignorePatterns.some(pattern => pattern.test(name));
}

function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'move': 'move',
    'toml': 'toml',
    'json': 'json',
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'md': 'markdown',
    'txt': 'plaintext',
    'yaml': 'yaml',
    'yml': 'yaml',
    'sh': 'shell',
    'rs': 'rust',
    'py': 'python',
  };

  return languageMap[ext || ''] || 'plaintext';
}
