import { config } from '../config';

const API_URL = config.api.baseUrl;

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
  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a new design
   */
  async createDesign(name: string, description?: string): Promise<Design> {
    try {
      const response = await this.request('/api/designer/design', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating design:', error);
      throw error;
    }
  }

  /**
   * Get design
   */
  async getDesign(id: string): Promise<Design> {
    try {
      const response = await this.request(`/api/designer/design/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching design:', error);
      throw error;
    }
  }

  /**
   * Update design
   */
  async updateDesign(id: string, updates: Partial<Design>): Promise<Design> {
    try {
      const response = await this.request(`/api/designer/design/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating design:', error);
      throw error;
    }
  }

  /**
   * Add component
   */
  async addComponent(designId: string, component: Omit<Component, 'id'>): Promise<Design> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/component`, {
        method: 'POST',
        body: JSON.stringify(component),
      });
      return response.data;
    } catch (error) {
      console.error('Error adding component:', error);
      throw error;
    }
  }

  /**
   * Update component
   */
  async updateComponent(
    designId: string,
    componentId: string,
    updates: Partial<Component>
  ): Promise<Design> {
    try {
      const response = await this.request(
        `/api/designer/design/${designId}/component/${componentId}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  }

  /**
   * Remove component
   */
  async removeComponent(designId: string, componentId: string): Promise<Design> {
    try {
      const response = await this.request(
        `/api/designer/design/${designId}/component/${componentId}`,
        { method: 'DELETE' }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing component:', error);
      throw error;
    }
  }

  /**
   * Add connection
   */
  async addConnection(designId: string, fromId: string, toId: string): Promise<Design> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/connection`, {
        method: 'POST',
        body: JSON.stringify({ fromId, toId }),
      });
      return response.data;
    } catch (error) {
      console.error('Error adding connection:', error);
      throw error;
    }
  }

  /**
   * Remove connection
   */
  async removeConnection(designId: string, fromId: string, toId: string): Promise<Design> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/connection`, {
        method: 'DELETE',
        body: JSON.stringify({ fromId, toId }),
      });
      return response.data;
    } catch (error) {
      console.error('Error removing connection:', error);
      throw error;
    }
  }

  /**
   * Generate Move code
   */
  async generateCode(designId: string, options?: GenerateCodeOptions): Promise<string> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/generate-code`, {
        method: 'POST',
        body: JSON.stringify(options || {}),
      });
      return response.data.code;
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  /**
   * Generate Mermaid diagram
   */
  async generateMermaidDiagram(designId: string): Promise<string> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/mermaid`);
      return response.data.diagram;
    } catch (error) {
      console.error('Error generating Mermaid diagram:', error);
      throw error;
    }
  }

  /**
   * Generate PlantUML diagram
   */
  async generatePlantUMLDiagram(designId: string): Promise<string> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/plantuml`);
      return response.data.diagram;
    } catch (error) {
      console.error('Error generating PlantUML diagram:', error);
      throw error;
    }
  }

  /**
   * Validate design
   */
  async validateDesign(designId: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/validate`);
      return response.data;
    } catch (error) {
      console.error('Error validating design:', error);
      throw error;
    }
  }

  /**
   * Export design
   */
  async exportDesign(designId: string): Promise<string> {
    try {
      const response = await this.request(`/api/designer/design/${designId}/export`);
      return response.data.json;
    } catch (error) {
      console.error('Error exporting design:', error);
      throw error;
    }
  }

  /**
   * Import design
   */
  async importDesign(json: string): Promise<Design> {
    try {
      const response = await this.request('/api/designer/import', {
        method: 'POST',
        body: JSON.stringify({ json }),
      });
      return response.data;
    } catch (error) {
      console.error('Error importing design:', error);
      throw error;
    }
  }
}

export const designerService = new DesignerService();
