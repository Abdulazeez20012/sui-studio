import { config } from '../config';

const API_URL = config.api.baseUrl;

export interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  location: {
    file: string;
    line?: number;
    column?: number;
  };
  codeSnippet?: string;
  recommendation: string;
  references?: string[];
}

export interface AuditReport {
  id: string;
  code: string;
  timestamp: Date;
  overallScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  issues: SecurityIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  gasOptimizations: string[];
  bestPractices: string[];
  recommendations: string[];
  aiAnalysis: string;
}

class AuditService {
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
   * Perform security audit
   */
  async auditCode(code: string): Promise<AuditReport> {
    try {
      const response = await this.request('/api/audit', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return response.data;
    } catch (error) {
      console.error('Error performing audit:', error);
      throw error;
    }
  }

  /**
   * Get audit report
   */
  async getAudit(auditId: string): Promise<AuditReport> {
    try {
      const response = await this.request(`/api/audit/${auditId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit:', error);
      throw error;
    }
  }

  /**
   * Export audit report
   */
  async exportAudit(auditId: string): Promise<string> {
    try {
      const response = await this.request(`/api/audit/${auditId}/export`);
      return response.data.json;
    } catch (error) {
      console.error('Error exporting audit:', error);
      throw error;
    }
  }
}

export const auditService = new AuditService();
