import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface GasEstimate {
  function: string;
  module: string;
  estimatedGas: number;
  confidence: 'low' | 'medium' | 'high';
  breakdown: GasBreakdown;
}

export interface GasBreakdown {
  computation: number;
  storage: number;
  objectCreation: number;
  eventEmission: number;
  packagePublishing?: number;
}

export interface GasOptimization {
  function: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  potentialSavings: number;
  lineNumber?: number;
}

export interface GasAnalysisResult {
  id: string;
  code: string;
  totalEstimatedGas: number;
  functionEstimates: GasEstimate[];
  optimizations: GasOptimization[];
  summary: {
    totalFunctions: number;
    averageGasPerFunction: number;
    mostExpensiveFunction: string;
    totalOptimizationPotential: number;
  };
  createdAt: Date;
}

export interface GasComparison {
  before: GasAnalysisResult;
  after: GasAnalysisResult;
  improvements: {
    totalGasSaved: number;
    percentageImprovement: number;
    functionsImproved: string[];
  };
}

class GasAnalyzerService {
  private analyses: Map<string, GasAnalysisResult> = new Map();

  /**
   * Analyze gas usage for Move code
   */
  async analyzeGas(code: string): Promise<GasAnalysisResult> {
    const analysisId = `gas-${Date.now()}`;
    
    // Extract functions from code
    const functions = this.extractFunctions(code);
    
    // Estimate gas for each function
    const functionEstimates = functions.map(func => this.estimateFunctionGas(func, code));
    
    // Find optimization opportunities
    const optimizations = this.findOptimizations(code, functionEstimates);
    
    // Calculate totals
    const totalEstimatedGas = functionEstimates.reduce((sum, est) => sum + est.estimatedGas, 0);
    const averageGasPerFunction = totalEstimatedGas / functionEstimates.length;
    const mostExpensiveFunction = functionEstimates.reduce((max, est) => 
      est.estimatedGas > max.estimatedGas ? est : max
    );
    const totalOptimizationPotential = optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);

    const result: GasAnalysisResult = {
      id: analysisId,
      code,
      totalEstimatedGas,
      functionEstimates,
      optimizations,
      summary: {
        totalFunctions: functionEstimates.length,
        averageGasPerFunction: Math.round(averageGasPerFunction),
        mostExpensiveFunction: mostExpensiveFunction.function,
        totalOptimizationPotential
      },
      createdAt: new Date()
    };

    this.analyses.set(analysisId, result);
    return result;
  }

  /**
   * Get analysis by ID
   */
  getAnalysis(id: string): GasAnalysisResult | null {
    return this.analyses.get(id) || null;
  }

  /**
   * Compare two gas analyses
   */
  compareAnalyses(beforeId: string, afterId: string): GasComparison | null {
    const before = this.analyses.get(beforeId);
    const after = this.analyses.get(afterId);

    if (!before || !after) return null;

    const totalGasSaved = before.totalEstimatedGas - after.totalEstimatedGas;
    const percentageImprovement = (totalGasSaved / before.totalEstimatedGas) * 100;
    
    const functionsImproved: string[] = [];
    before.functionEstimates.forEach(beforeFunc => {
      const afterFunc = after.functionEstimates.find(f => f.function === beforeFunc.function);
      if (afterFunc && afterFunc.estimatedGas < beforeFunc.estimatedGas) {
        functionsImproved.push(beforeFunc.function);
      }
    });

    return {
      before,
      after,
      improvements: {
        totalGasSaved,
        percentageImprovement: Math.round(percentageImprovement * 100) / 100,
        functionsImproved
      }
    };
  }

  /**
   * Get gas estimation for specific transaction types
   */
  getTransactionGasEstimate(transactionType: string): GasBreakdown {
    const estimates: Record<string, GasBreakdown> = {
      'simple_transfer': {
        computation: 1000,
        storage: 500,
        objectCreation: 0,
        eventEmission: 200
      },
      'nft_mint': {
        computation: 2500,
        storage: 1500,
        objectCreation: 2000,
        eventEmission: 300
      },
      'defi_swap': {
        computation: 3500,
        storage: 1000,
        objectCreation: 500,
        eventEmission: 400
      },
      'package_publish': {
        computation: 5000,
        storage: 3000,
        objectCreation: 0,
        eventEmission: 500,
        packagePublishing: 10000
      }
    };

    return estimates[transactionType] || estimates['simple_transfer'];
  }

  /**
   * Extract functions from Move code
   */
  private extractFunctions(code: string): Array<{ name: string; module: string; body: string }> {
    const functions: Array<{ name: string; module: string; body: string }> = [];
    
    // Extract module name
    const moduleMatch = code.match(/module\s+(\w+)::(\w+)/);
    const moduleName = moduleMatch ? `${moduleMatch[1]}::${moduleMatch[2]}` : 'unknown';

    // Extract functions with their bodies
    const functionRegex = /(?:public\s+)?(?:entry\s+)?fun\s+(\w+)\s*\([^)]*\)[^{]*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    let match;

    while ((match = functionRegex.exec(code)) !== null) {
      functions.push({
        name: match[1],
        module: moduleName,
        body: match[2]
      });
    }

    // If no functions found, create sample data
    if (functions.length === 0) {
      functions.push(
        { name: 'transfer', module: 'example::token', body: 'transfer::public_transfer(coin, recipient);' },
        { name: 'mint', module: 'example::token', body: 'let coin = coin::mint(&mut treasury, amount, ctx);' }
      );
    }

    return functions;
  }

  /**
   * Estimate gas for a function
   */
  private estimateFunctionGas(func: { name: string; module: string; body: string }, fullCode: string): GasEstimate {
    let estimatedGas = 1000; // Base gas cost
    let confidence: 'low' | 'medium' | 'high' = 'medium';

    const breakdown: GasBreakdown = {
      computation: 1000,
      storage: 0,
      objectCreation: 0,
      eventEmission: 0
    };

    // Analyze function body for gas-consuming operations
    const body = func.body.toLowerCase();

    // Storage operations
    const storageOps = (body.match(/\.(insert|remove|borrow|borrow_mut)/g) || []).length;
    breakdown.storage += storageOps * 300;
    estimatedGas += storageOps * 300;

    // Object creation
    const objectCreations = (body.match(/object::new|new\(/g) || []).length;
    breakdown.objectCreation += objectCreations * 2000;
    estimatedGas += objectCreations * 2000;

    // Event emissions
    const events = (body.match(/event::emit/g) || []).length;
    breakdown.eventEmission += events * 200;
    estimatedGas += events * 200;

    // Loops (expensive)
    const loops = (body.match(/while|for|loop/g) || []).length;
    breakdown.computation += loops * 1500;
    estimatedGas += loops * 1500;

    // Vector operations
    const vectorOps = (body.match(/vector::|\.push_back|\.pop_back|\.length/g) || []).length;
    breakdown.computation += vectorOps * 100;
    estimatedGas += vectorOps * 100;

    // Transfer operations
    const transfers = (body.match(/transfer::|public_transfer/g) || []).length;
    breakdown.computation += transfers * 500;
    estimatedGas += transfers * 500;

    // Function complexity based on name patterns
    const complexityMultipliers: Record<string, number> = {
      'create': 1.5,
      'mint': 2.0,
      'burn': 1.8,
      'swap': 2.5,
      'deposit': 1.3,
      'withdraw': 1.4,
      'transfer': 1.0,
      'update': 1.2,
      'delete': 1.1
    };

    const funcNameLower = func.name.toLowerCase();
    for (const [pattern, multiplier] of Object.entries(complexityMultipliers)) {
      if (funcNameLower.includes(pattern)) {
        estimatedGas = Math.floor(estimatedGas * multiplier);
        breakdown.computation = Math.floor(breakdown.computation * multiplier);
        break;
      }
    }

    // Adjust confidence based on complexity
    if (loops > 0 || objectCreations > 2 || storageOps > 5) {
      confidence = 'low';
    } else if (storageOps > 0 || objectCreations > 0 || events > 0) {
      confidence = 'medium';
    } else {
      confidence = 'high';
    }

    return {
      function: func.name,
      module: func.module,
      estimatedGas,
      confidence,
      breakdown
    };
  }

  /**
   * Find gas optimization opportunities
   */
  private findOptimizations(code: string, estimates: GasEstimate[]): GasOptimization[] {
    const optimizations: GasOptimization[] = [];
    const lines = code.split('\n');

    // Check for expensive operations
    estimates.forEach(estimate => {
      if (estimate.estimatedGas > 3000) {
        optimizations.push({
          function: estimate.function,
          issue: 'High gas consumption',
          severity: estimate.estimatedGas > 5000 ? 'high' : 'medium',
          suggestion: 'Consider breaking down into smaller functions or optimizing storage operations',
          potentialSavings: Math.floor((estimate.estimatedGas - 2000) * 0.3)
        });
      }

      if (estimate.breakdown.storage > 1000) {
        optimizations.push({
          function: estimate.function,
          issue: 'Excessive storage operations',
          severity: 'medium',
          suggestion: 'Batch storage operations or use more efficient data structures',
          potentialSavings: Math.floor(estimate.breakdown.storage * 0.4)
        });
      }

      if (estimate.breakdown.objectCreation > 4000) {
        optimizations.push({
          function: estimate.function,
          issue: 'Multiple object creations',
          severity: 'medium',
          suggestion: 'Consider object pooling or reducing object creation',
          potentialSavings: Math.floor(estimate.breakdown.objectCreation * 0.25)
        });
      }
    });

    // Pattern-based optimizations
    lines.forEach((line, index) => {
      const trimmedLine = line.trim().toLowerCase();

      // Inefficient loops
      if (trimmedLine.includes('while') && trimmedLine.includes('vector::length')) {
        optimizations.push({
          function: 'unknown',
          issue: 'Inefficient loop with vector::length',
          severity: 'medium',
          suggestion: 'Cache vector length outside the loop',
          potentialSavings: 200,
          lineNumber: index + 1
        });
      }

      // Repeated storage access
      if (trimmedLine.includes('.borrow_mut') || trimmedLine.includes('.borrow')) {
        const borrowCount = (code.match(/\.borrow(_mut)?/g) || []).length;
        if (borrowCount > 3) {
          optimizations.push({
            function: 'unknown',
            issue: 'Repeated storage access',
            severity: 'low',
            suggestion: 'Cache borrowed references to reduce storage access',
            potentialSavings: borrowCount * 50,
            lineNumber: index + 1
          });
        }
      }

      // Unnecessary event emissions
      if (trimmedLine.includes('event::emit') && code.includes('event::emit')) {
        const eventCount = (code.match(/event::emit/g) || []).length;
        if (eventCount > 5) {
          optimizations.push({
            function: 'unknown',
            issue: 'Excessive event emissions',
            severity: 'low',
            suggestion: 'Consolidate events or emit only critical events',
            potentialSavings: eventCount * 30,
            lineNumber: index + 1
          });
        }
      }
    });

    // Remove duplicates and sort by potential savings
    const uniqueOptimizations = optimizations.filter((opt, index, arr) => 
      arr.findIndex(o => o.issue === opt.issue && o.function === opt.function) === index
    );

    return uniqueOptimizations.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  /**
   * Generate gas optimization report
   */
  generateOptimizationReport(analysisId: string): string {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) throw new Error('Analysis not found');

    let report = `# Gas Analysis Report\n\n`;
    report += `**Analysis ID:** ${analysis.id}\n`;
    report += `**Date:** ${analysis.createdAt.toISOString()}\n`;
    report += `**Total Estimated Gas:** ${analysis.totalEstimatedGas} MIST\n\n`;

    report += `## Summary\n`;
    report += `- **Total Functions:** ${analysis.summary.totalFunctions}\n`;
    report += `- **Average Gas per Function:** ${analysis.summary.averageGasPerFunction} MIST\n`;
    report += `- **Most Expensive Function:** ${analysis.summary.mostExpensiveFunction}\n`;
    report += `- **Total Optimization Potential:** ${analysis.summary.totalOptimizationPotential} MIST\n\n`;

    report += `## Function Gas Estimates\n\n`;
    analysis.functionEstimates.forEach(est => {
      report += `### ${est.function} (${est.module})\n`;
      report += `- **Estimated Gas:** ${est.estimatedGas} MIST (${est.confidence} confidence)\n`;
      report += `- **Breakdown:**\n`;
      report += `  - Computation: ${est.breakdown.computation} MIST\n`;
      report += `  - Storage: ${est.breakdown.storage} MIST\n`;
      report += `  - Object Creation: ${est.breakdown.objectCreation} MIST\n`;
      report += `  - Event Emission: ${est.breakdown.eventEmission} MIST\n`;
      if (est.breakdown.packagePublishing) {
        report += `  - Package Publishing: ${est.breakdown.packagePublishing} MIST\n`;
      }
      report += `\n`;
    });

    if (analysis.optimizations.length > 0) {
      report += `## Optimization Opportunities\n\n`;
      analysis.optimizations.forEach((opt, index) => {
        report += `### ${index + 1}. ${opt.issue}\n`;
        report += `- **Function:** ${opt.function}\n`;
        report += `- **Severity:** ${opt.severity}\n`;
        report += `- **Potential Savings:** ${opt.potentialSavings} MIST\n`;
        report += `- **Suggestion:** ${opt.suggestion}\n`;
        if (opt.lineNumber) {
          report += `- **Line:** ${opt.lineNumber}\n`;
        }
        report += `\n`;
      });
    }

    return report;
  }

  /**
   * Clean up old analyses
   */
  cleanupAnalyses(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, analysis] of this.analyses.entries()) {
      if (now - analysis.createdAt.getTime() > maxAge) {
        this.analyses.delete(id);
      }
    }
  }
}

export const gasAnalyzer = new GasAnalyzerService();

// Cleanup old analyses every hour
setInterval(() => {
  gasAnalyzer.cleanupAnalyses();
}, 3600000);