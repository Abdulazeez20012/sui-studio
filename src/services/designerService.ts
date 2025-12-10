import { apiService } from './api';

export interface Component {
  id: string;
  type: 'module' | 'object' | 'resource' | 'capability' | 'function';
  name: string;
  x: number;
  y: number;
  connections: string[];
  properties?: Record<string, any>;
}

export interface Design {
  id: string;
  name: string;
  description?: string;
  components: Component[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateCodeOptions {
  moduleName?: string;
  includeComments?: boolean;
  includeTests?: boolean;
}

class DesignerService {
  async createDesign(name: string, description?: string): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: Design }>('/designer/design', {
        name,
        description
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getDesign(designId: string): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: Design }>(`/designer/design/${designId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateDesign(designId: string, updates: Partial<Design>): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.put<{ success: boolean; data: Design }>(`/designer/design/${designId}`, updates);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async addComponent(designId: string, component: Omit<Component, 'id'>): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: Design }>(`/designer/design/${designId}/component`, component);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateComponent(designId: string, componentId: string, updates: Partial<Component>): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.put<{ success: boolean; data: Design }>(`/designer/design/${designId}/component/${componentId}`, updates);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async removeComponent(designId: string, componentId: string): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; data: Design }>(`/designer/design/${designId}/component/${componentId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async addConnection(designId: string, fromId: string, toId: string): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: Design }>(`/designer/design/${designId}/connection`, {
        fromId,
        toId
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async removeConnection(designId: string, fromId: string, toId: string): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; data: Design }>(`/designer/design/${designId}/connection`, {
        fromId,
        toId
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async generateCode(designId: string, options: GenerateCodeOptions = {}): Promise<{ success: boolean; data?: { code: string }; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: { code: string } }>(`/designer/design/${designId}/generate-code`, options);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async generateMermaidDiagram(designId: string): Promise<{ success: boolean; data?: { diagram: string }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { diagram: string } }>(`/designer/design/${designId}/mermaid`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async generatePlantUMLDiagram(designId: string): Promise<{ success: boolean; data?: { diagram: string }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { diagram: string } }>(`/designer/design/${designId}/plantuml`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async validateDesign(designId: string): Promise<{ success: boolean; data?: { valid: boolean; errors: string[] }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { valid: boolean; errors: string[] } }>(`/designer/design/${designId}/validate`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async exportDesign(designId: string): Promise<{ success: boolean; data?: { json: string }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { json: string } }>(`/designer/design/${designId}/export`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async importDesign(json: string): Promise<{ success: boolean; data?: Design; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: Design }>('/designer/import', { json });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const designerService = new DesignerService();