const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async googleAuth(userData: any) {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });
    const data = await this.handleResponse(response);
    
    // Store token
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Project endpoints
  async getProjects() {
    const response = await fetch(`${API_URL}/api/projects`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProject(id: string) {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createProject(data: any) {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateProject(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteProject(id: string) {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Compilation endpoints
  async compileCode(code: string, packageName?: string) {
    const response = await fetch(`${API_URL}/api/compile`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, packageName }),
    });
    return this.handleResponse(response);
  }

  async estimateGas(code: string) {
    const response = await fetch(`${API_URL}/api/compile/estimate-gas`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code }),
    });
    return this.handleResponse(response);
  }

  // Deployment endpoints
  async deployContract(data: {
    projectId: string;
    network: string;
    bytecode: string;
    gasBudget?: number;
  }) {
    const response = await fetch(`${API_URL}/api/deploy`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getDeployment(id: string) {
    const response = await fetch(`${API_URL}/api/deploy/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProjectDeployments(projectId: string) {
    const response = await fetch(`${API_URL}/api/deploy/project/${projectId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Sui network endpoints
  async getNetworkInfo(network: string) {
    const response = await fetch(`${API_URL}/api/sui/network/${network}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTransaction(digest: string, network: string) {
    const response = await fetch(
      `${API_URL}/api/sui/transaction/${digest}?network=${network}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getGasPrice(network: string) {
    const response = await fetch(`${API_URL}/api/sui/gas-price/${network}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getUserAnalytics() {
    const response = await fetch(`${API_URL}/api/analytics/user`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProjectAnalytics(projectId: string) {
    const response = await fetch(`${API_URL}/api/analytics/project/${projectId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async trackEvent(event: string, metadata?: any) {
    const response = await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ event, metadata }),
    });
    return this.handleResponse(response);
  }

  // AI endpoints
  async sendAIMessage(message: string, conversationId?: string, context?: any) {
    const response = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, conversationId, context }),
    });
    return this.handleResponse(response);
  }

  async getAIConversations() {
    const response = await fetch(`${API_URL}/api/ai/conversations`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAIConversation(id: string) {
    const response = await fetch(`${API_URL}/api/ai/conversations/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteAIConversation(id: string) {
    const response = await fetch(`${API_URL}/api/ai/conversations/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Extensions endpoints
  async getInstalledExtensions() {
    const response = await fetch(`${API_URL}/api/extensions/installed`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async installExtension(extensionId: string) {
    const response = await fetch(`${API_URL}/api/extensions/install`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ extensionId }),
    });
    return this.handleResponse(response);
  }

  async uninstallExtension(extensionId: string) {
    const response = await fetch(`${API_URL}/api/extensions/uninstall/${extensionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async toggleExtension(extensionId: string, enabled: boolean) {
    const response = await fetch(`${API_URL}/api/extensions/toggle/${extensionId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ enabled }),
    });
    return this.handleResponse(response);
  }

  // Terminal command execution
  async executeCommand(command: string, workingDir?: string) {
    const response = await fetch(`${API_URL}/api/terminal/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ command, workingDir }),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new APIService();
