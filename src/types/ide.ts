export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export interface Terminal {
  id: string;
  name: string;
  output: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: FileNode[];
  createdAt: Date;
  updatedAt: Date;
}

export type PanelType = 'explorer' | 'search' | 'git' | 'extensions';
export type RightPanelType = 'deployment' | 'gas' | 'collaboration' | 'settings' | 'stats' | 'docs' | 'extensions' | 'nexi' | 'wallet' | 'contract';
export type ViewMode = 'editor' | 'split' | 'preview';
