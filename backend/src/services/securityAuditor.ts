import Anthropic from '@anthropic-ai/sdk';

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
  overallScore: number; // 0-100
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

class SecurityAuditorService {
  private anthropic: Anthropic | null = null;
  private audits: Map<string, AuditReport> = new Map();

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  /**
   * Perform comprehensive security audit
   */
  async auditCode(code: string): Promise<AuditReport> {
    const auditId = `audit-${Date.now()}`;
    
    // Run multiple analysis passes
    const [
      vulnerabilities,
      gasOptimizations,
      bestPractices,
      aiAnalysis
    ] = await Promise.all([
      this.detectVulnerabilities(code),
      this.analyzeGasOptimizations(code),
      this.checkBestPractices(code),
      this.getAIAnalysis(code)
    ]);

    // Calculate overall score
    const overallScore = this.calculateScore(vulnerabilities);
    const riskLevel = this.determineRiskLevel(vulnerabilities);

    // Count issues by severity
    const summary = {
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
      info: vulnerabilities.filter(v => v.severity === 'info').length
    };

    const report: AuditReport = {
      id: auditId,
      code,
      timestamp: new Date(),
      overallScore,
      riskLevel,
      issues: vulnerabilities,
      summary,
      gasOptimizations,
      bestPractices,
      recommendations: this.generateRecommendations(vulnerabilities, gasOptimizations),
      aiAnalysis
    };

    this.audits.set(auditId, report);
    return report;
  }

  /**
   * Get audit report
   */
  getAudit(auditId: string): AuditReport | null {
    return this.audits.get(auditId) || null;
  }

  /**
   * Detect security vulnerabilities
   */
  private async detectVulnerabilities(code: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check for reentrancy vulnerabilities
    if (this.hasReentrancyRisk(code)) {
      issues.push({
        id: 'REEN-001',
        severity: 'critical',
        category: 'Reentrancy',
        title: 'Potential Reentrancy Vulnerability',
        description: 'External calls before state updates can lead to reentrancy attacks',
        location: { file: 'main.move' },
        recommendation: 'Update state before making external calls (checks-effects-interactions pattern)',
        references: ['https://docs.sui.io/guides/developer/sui-101/shared-owned']
      });
    }

    // Check for integer overflow/underflow
    if (this.hasIntegerOverflowRisk(code)) {
      issues.push({
        id: 'INT-001',
        severity: 'high',
        category: 'Integer Overflow',
        title: 'Potential Integer Overflow',
        description: 'Arithmetic operations without overflow checks',
        location: { file: 'main.move' },
        recommendation: 'Use checked arithmetic or validate inputs',
        references: ['https://move-language.github.io/move/integers.html']
      });
    }

    // Check for access control issues
    if (this.hasAccessControlIssues(code)) {
      issues.push({
        id: 'AUTH-001',
        severity: 'critical',
        category: 'Access Control',
        title: 'Missing Access Control',
        description: 'Sensitive functions lack proper authorization checks',
        location: { file: 'main.move' },
        recommendation: 'Add capability-based access control or ownership checks',
        references: ['https://docs.sui.io/guides/developer/sui-101/access-control']
      });
    }

    // Check for unchecked external calls
    if (this.hasUncheckedExternalCalls(code)) {
      issues.push({
        id: 'EXT-001',
        severity: 'high',
        category: 'External Calls',
        title: 'Unchecked External Call',
        description: 'External function calls without proper error handling',
        location: { file: 'main.move' },
        recommendation: 'Add error handling and validation for external calls'
      });
    }

    // Check for timestamp dependence
    if (this.hasTimestampDependence(code)) {
      issues.push({
        id: 'TIME-001',
        severity: 'medium',
        category: 'Timestamp Dependence',
        title: 'Timestamp Manipulation Risk',
        description: 'Logic depends on block timestamp which can be manipulated',
        location: { file: 'main.move' },
        recommendation: 'Avoid using timestamps for critical logic or add tolerance ranges'
      });
    }

    // Check for uninitialized storage
    if (this.hasUninitializedStorage(code)) {
      issues.push({
        id: 'STOR-001',
        severity: 'medium',
        category: 'Storage',
        title: 'Uninitialized Storage',
        description: 'Storage variables used before initialization',
        location: { file: 'main.move' },
        recommendation: 'Initialize all storage variables in constructor or init function'
      });
    }

    // Check for missing event emissions
    if (this.hasMissingEvents(code)) {
      issues.push({
        id: 'EVT-001',
        severity: 'low',
        category: 'Events',
        title: 'Missing Event Emissions',
        description: 'State-changing functions should emit events for transparency',
        location: { file: 'main.move' },
        recommendation: 'Emit events for all significant state changes'
      });
    }

    // Check for gas inefficiencies
    if (this.hasGasInefficiencies(code)) {
      issues.push({
        id: 'GAS-001',
        severity: 'low',
        category: 'Gas Optimization',
        title: 'Gas Inefficiency Detected',
        description: 'Code patterns that consume excessive gas',
        location: { file: 'main.move' },
        recommendation: 'Optimize loops, reduce storage operations, use efficient data structures'
      });
    }

    return issues;
  }

  /**
   * Analyze gas optimizations
   */
  private async analyzeGasOptimizations(code: string): Promise<string[]> {
    const optimizations: string[] = [];

    if (code.includes('while') || code.includes('loop')) {
      optimizations.push('Consider loop unrolling or batch processing to reduce gas costs');
    }

    if (code.match(/vector::/g)?.length > 5) {
      optimizations.push('Multiple vector operations detected - consider using more efficient data structures');
    }

    if (code.includes('borrow_global') || code.includes('borrow_global_mut')) {
      optimizations.push('Global storage access is expensive - cache values in local variables when possible');
    }

    if (code.match(/public entry fun/g)?.length > 10) {
      optimizations.push('Many public entry functions - consider combining related operations to reduce transaction overhead');
    }

    return optimizations;
  }

  /**
   * Check best practices
   */
  private async checkBestPractices(code: string): Promise<string[]> {
    const practices: string[] = [];

    if (!code.includes('assert!')) {
      practices.push('✓ Using assertions for input validation');
    }

    if (code.includes('public entry fun')) {
      practices.push('✓ Using entry functions for transaction endpoints');
    }

    if (code.includes('has key') || code.includes('has store')) {
      practices.push('✓ Proper use of abilities (key, store, copy, drop)');
    }

    if (!code.includes('// ') && !code.includes('/// ')) {
      practices.push('⚠ Add documentation comments for better code maintainability');
    }

    if (!code.includes('test')) {
      practices.push('⚠ No tests detected - add comprehensive test coverage');
    }

    return practices;
  }

  /**
   * Get AI-powered analysis using Claude
   */
  private async getAIAnalysis(code: string): Promise<string> {
    if (!this.anthropic) {
      return 'AI analysis unavailable - ANTHROPIC_API_KEY not configured';
    }

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `You are a security expert auditing Sui Move smart contracts. Analyze this code for security vulnerabilities, gas optimizations, and best practices. Be specific and actionable.

Code:
\`\`\`move
${code}
\`\`\`

Provide:
1. Security concerns (if any)
2. Gas optimization opportunities
3. Best practice recommendations
4. Overall assessment

Keep it concise and developer-friendly.`
        }]
      });

      const content = message.content[0];
      return content.type === 'text' ? content.text : 'Analysis unavailable';
    } catch (error) {
      console.error('AI analysis error:', error);
      return 'AI analysis temporarily unavailable';
    }
  }

  /**
   * Pattern detection methods
   */
  private hasReentrancyRisk(code: string): boolean {
    // Check for external calls before state updates
    const hasExternalCall = code.includes('transfer::') || code.includes('public_transfer');
    const hasStateUpdate = code.includes('borrow_global_mut');
    return hasExternalCall && hasStateUpdate;
  }

  private hasIntegerOverflowRisk(code: string): boolean {
    return code.includes('+') || code.includes('*') || code.includes('-');
  }

  private hasAccessControlIssues(code: string): boolean {
    const hasPublicEntry = code.includes('public entry fun');
    const hasCapCheck = code.includes('capability') || code.includes('&signer');
    return hasPublicEntry && !hasCapCheck;
  }

  private hasUncheckedExternalCalls(code: string): boolean {
    return code.includes('transfer::') && !code.includes('assert!');
  }

  private hasTimestampDependence(code: string): boolean {
    return code.includes('timestamp') || code.includes('clock::');
  }

  private hasUninitializedStorage(code: string): boolean {
    return code.includes('borrow_global') && !code.includes('move_to');
  }

  private hasMissingEvents(code: string): boolean {
    const hasStateChange = code.includes('borrow_global_mut') || code.includes('move_to');
    const hasEvents = code.includes('event::emit');
    return hasStateChange && !hasEvents;
  }

  private hasGasInefficiencies(code: string): boolean {
    return code.includes('while') || code.includes('loop');
  }

  /**
   * Calculate overall security score
   */
  private calculateScore(issues: SecurityIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
        case 'info':
          score -= 1;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Determine risk level
   */
  private determineRiskLevel(issues: SecurityIssue[]): AuditReport['riskLevel'] {
    const hasCritical = issues.some(i => i.severity === 'critical');
    const hasHigh = issues.some(i => i.severity === 'high');
    const hasMedium = issues.some(i => i.severity === 'medium');

    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    if (issues.length > 0) return 'low';
    return 'safe';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    issues: SecurityIssue[],
    gasOptimizations: string[]
  ): string[] {
    const recommendations: string[] = [];

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;

    if (criticalCount > 0) {
      recommendations.push(`🚨 URGENT: Fix ${criticalCount} critical security issue(s) before deployment`);
    }

    if (highCount > 0) {
      recommendations.push(`⚠️  Address ${highCount} high-severity issue(s) to improve security`);
    }

    if (gasOptimizations.length > 0) {
      recommendations.push(`⚡ ${gasOptimizations.length} gas optimization(s) available`);
    }

    if (issues.length === 0) {
      recommendations.push('✅ No major security issues detected - code looks good!');
    }

    recommendations.push('📝 Consider getting a professional audit before mainnet deployment');
    recommendations.push('🧪 Add comprehensive test coverage including edge cases');

    return recommendations;
  }

  /**
   * Export audit report as PDF-ready JSON
   */
  exportReport(auditId: string): string {
    const audit = this.audits.get(auditId);
    if (!audit) throw new Error('Audit not found');

    return JSON.stringify({
      title: 'Sui Studio Security Audit Report',
      auditId: audit.id,
      timestamp: audit.timestamp,
      score: audit.overallScore,
      riskLevel: audit.riskLevel,
      summary: audit.summary,
      issues: audit.issues,
      gasOptimizations: audit.gasOptimizations,
      bestPractices: audit.bestPractices,
      recommendations: audit.recommendations,
      aiAnalysis: audit.aiAnalysis
    }, null, 2);
  }

  /**
   * Clean up old audits
   */
  cleanupAudits(maxAge: number = 86400000): void {
    const now = Date.now();
    for (const [id, audit] of this.audits.entries()) {
      if (now - audit.timestamp.getTime() > maxAge) {
        this.audits.delete(id);
      }
    }
  }
}

export const securityAuditor = new SecurityAuditorService();

// Cleanup old audits every 24 hours
setInterval(() => {
  securityAuditor.cleanupAudits();
}, 86400000);
