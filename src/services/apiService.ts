import { config } from '../config';
import { logger } from '../utils/logger';

const API_URL = config.api.baseUrl;

class APIService {
  private wakeUpInProgress = false;
  private isConnected = false;
  private connectionListeners: ((connected: boolean) => void)[] = [];

  constructor() {
    // Start health check polling
    this.checkHealth();
    setInterval(() => this.checkHealth(), 5000);
  }

  // Subscribe to connection status changes
  onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionListeners.push(listener);
    listener(this.isConnected);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  private setConnected(connected: boolean) {
    if (this.isConnected !== connected) {
      this.isConnected = connected;
      this.connectionListeners.forEach(l => l(connected));
    }
  }

  // Wake up the backend (for Render free tier that sleeps after inactivity)
  async wakeUpBackend(): Promise<boolean> {
    if (this.wakeUpInProgress) return false;

    this.wakeUpInProgress = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_URL}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.wakeUpInProgress = false;
      this.setConnected(response.ok);

      return response.ok;
    } catch (error) {
      this.wakeUpInProgress = false;
      logger.debug('Backend wake-up in progress or unavailable');
      this.setConnected(false);
      return false;
    }
  }

  private async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      this.setConnected(response.ok);
    } catch (error) {
      this.setConnected(false);
    }
  }

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
  async compileCode(code: string, packageName?: string, options?: {
    skipFetch?: boolean;
    testMode?: boolean;
    generateDocs?: boolean;
  }) {
    if (!this.isConnected) {
      throw new Error('Backend disconnected. Please run start-backend.bat');
    }
    const response = await fetch(`${API_URL}/api/compile`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, packageName, options }),
    });
    return this.handleResponse(response);
  }

  async estimateGas(code: string) {
    if (!this.isConnected) {
      throw new Error('Backend disconnected. Please run start-backend.bat');
    }
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
    if (!this.isConnected) {
      throw new Error('Backend disconnected. Please run start-backend.bat');
    }
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
    if (!this.isConnected) {
      // Allow 'help' and 'clear' even if disconnected
      if (command === 'help' || command === 'clear') {
        return this.simulateCommand(command);
      }
      throw new Error('Backend disconnected. Please run start-backend.bat');
    }

    try {
      const response = await fetch(`${API_URL}/api/terminal/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ command, workingDir }),
      });
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Simulate command execution locally (fallback)
  private async simulateCommand(command: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (command === 'clear') {
      return { success: true, output: '' };
    }

    if (command === 'help') {
      return {
        success: true,
        output: `Available commands:
  sui move build    - Build the current Move package
  sui move test     - Run Move tests
  sui client        - Sui client commands
  clear             - Clear terminal
  help              - Show this help message
  
  NOTE: Backend is currently DISCONNECTED. Connect backend for full functionality.`,
      };
    }

    // Default response for unknown commands
    return {
      success: false,
      error: `Command not found: ${command}`,
      output: `bash: ${command}: command not found\nTry 'help' for available commands.`,
    };
  }

  // Project initialization
  async initializeProject(name: string, template?: string) {
    const response = await fetch(`${API_URL}/api/project-init/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, template }),
    });
    return this.handleResponse(response);
  }

  async getProjectStructure(projectName: string) {
    const response = await fetch(`${API_URL}/api/project-init/structure/${projectName}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createModule(projectName: string, moduleName: string, includeTests = true) {
    const response = await fetch(`${API_URL}/api/project-init/create-module`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ projectName, moduleName, includeTests }),
    });
    return this.handleResponse(response);
  }

  // Contract publishing (real deployment to Sui network)
  async publishContract(data: {
    code: string;
    packageName: string;
    network: string;
    walletAddress: string;
  }) {
    if (!this.isConnected) {
      throw new Error('Backend disconnected. Please run start-backend.bat');
    }
    const response = await fetch(`${API_URL}/api/deploy/publish`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Walrus deployment
  async deployToWalrus(data: {
    projectName: string;
    files: Array<{ name: string; content: string }>;
  }) {
    if (!this.isConnected) {
      throw new Error('Backend disconnected. Please run start-backend.bat');
    }
    const response = await fetch(`${API_URL}/api/walrus/deploy`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new APIService();
