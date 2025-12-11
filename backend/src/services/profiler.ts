/**
 * Real Move Profiler Service
 * Analyzes Move code execution and provides real metrics
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SuiClient } from '@mysten/sui/client';

const execAsync = promisify(exec);

export interface ProfileResult {
  id: string;
  code: string;
  functions: FunctionProfile[];
  gasAnalysis: GasAnalysis;
  memoryAnalysis: MemoryAnalysis;
  executionTrace?: ExecutionTrace[];
  timestamp: Date;
  cliAvailable: boolean;
}

export interface FunctionProfile {
  name: string;
  module: string;
  gasUsed: number;
  executionTime: number;
  callCount: number;
  bytecodeSize: number;
  complexity: 'low' | 'medium' | 'high';
  hotspots: Hotspot[];
}

export interface Hotspot {
  line: number;
  operation: string;
  gasCost: number;
  suggestion?: string;
}

export interface GasAnalysis {
  totalGas: number;
  computationCost: number;
  storageCost: number;
  storageRebate: number;
  breakdown: GasBreakdown[];
}

export interface GasBreakdown {
  category: string;
  gas: number;
  percentage: number;
}

export interface MemoryAnalysis {
  peakMemory: number;
  allocations: number;
  deallocations: number;
  objectsCreated: number;
  vectorOperations: number;
}

export interface ExecutionTrace {
  step: number;
  instruction: string;
  gasUsed: number;
  stackDepth: number;
  locals: Record<string, any>;
}

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

class ProfilerService {
  private tempDir: string = '/tmp/sui-profile';
  private profiles: Map<string, ProfileResult> = new Map();
  private suiCliAvailable: boolean | null = null;

  constructor() {
    this.initTempDir();
  }

  private async initTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  private getClient(network: string = 'testnet'): SuiClient {
    return new SuiClient({ url: RPC_URLS[network] || RPC_URLS.testnet });
  }

  /**
   * Check if Sui CLI is available
   */
  async checkSuiCLI(): Promise<boolean> {
    if (this.suiCliAvailable !== null) {
      return this.suiCliAvailable;
    }

    try {
      await execAsync('sui --version', { timeout: 5000 });
      this.suiCliAvailable = true;
      return true;
    } catch {
      this.suiCliAvailable = false;
      return false;
    }
  }

  /**
   * Profile Move code - compile and analyze
   */
  async profileCode(code: string, packageName: string = 'profile_package'): Promise<ProfileResult> {
    const profileId = `profile-${Date.now()}`;
    const cliAvailable = await this.checkSuiCLI();

    // Analyze code statically
    const functions = this.analyzeFunctions(code);
    const gasAnalysis = this.analyzeGas(code, functions);
    const memoryAnalysis = this.analyzeMemory(code);

    // If CLI available, get real bytecode sizes
    if (cliAvailable) {
      await this.enrichWithCompilation(code, packageName, functions);
    }

    const result: ProfileResult = {
      id: profileId,
      code,
      functions,
      gasAnalysis,
      memoryAnalysis,
      timestamp: new Date(),
      cliAvailable,
    };

    this.profiles.set(profileId, result);
    return result;
  }

  /**
   * Profile a real transaction from blockchain
   */
  async profileTransaction(txDigest: string, network: string = 'testnet'): Promise<ProfileResult> {
    const profileId = `tx-profile-${Date.now()}`;
    const client = this.getClient(network);

    try {
      const tx = await client.getTransactionBlock({
        digest: txDigest,
        options: {
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true,
        },
      });

      const gasUsed = tx.effects?.gasUsed;
      const computationCost = Number(gasUsed?.computationCost || 0);
      const storageCost = Number(gasUsed?.storageCost || 0);
      const storageRebate = Number(gasUsed?.storageRebate || 0);
      const totalGas = computationCost + storageCost - storageRebate;

      // Analyze object changes for memory
      const objectChanges = tx.objectChanges || [];
      const created = objectChanges.filter((c) => c.type === 'created').length;
      const mutated = objectChanges.filter((c) => c.type === 'mutated').length;
      const deleted = objectChanges.filter((c) => c.type === 'deleted').length;

      // Extract function calls from transaction
      const functions: FunctionProfile[] = [];
      const moveCall = (tx.transaction?.data as any)?.transaction?.transactions?.[0]?.MoveCall;
      if (moveCall) {
        functions.push({
          name: moveCall.function,
          module: `${moveCall.package}::${moveCall.module}`,
          gasUsed: totalGas,
          executionTime: 0,
          callCount: 1,
          bytecodeSize: 0,
          complexity: totalGas > 5000 ? 'high' : totalGas > 2000 ? 'medium' : 'low',
          hotspots: [],
        });
      }

      const result: ProfileResult = {
        id: profileId,
        code: '',
        functions,
        gasAnalysis: {
          totalGas,
          computationCost,
          storageCost,
          storageRebate,
          breakdown: [
            { category: 'Computation', gas: computationCost, percentage: (computationCost / totalGas) * 100 },
            { category: 'Storage', gas: storageCost, percentage: (storageCost / totalGas) * 100 },
            { category: 'Rebate', gas: -storageRebate, percentage: (-storageRebate / totalGas) * 100 },
          ],
        },
        memoryAnalysis: {
          peakMemory: 0,
          allocations: created + mutated,
          deallocations: deleted,
          objectsCreated: created,
          vectorOperations: 0,
        },
        timestamp: new Date(),
        cliAvailable: true,
      };

      this.profiles.set(profileId, result);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to profile transaction: ${error.message}`);
    }
  }

  /**
   * Analyze functions in code
   */
  private analyzeFunctions(code: string): FunctionProfile[] {
    const functions: FunctionProfile[] = [];
    const funcRegex = /(?:public\s+)?(?:entry\s+)?fun\s+(\w+)\s*(?:<[^>]*>)?\s*\([^)]*\)[^{]*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    const moduleMatch = code.match(/module\s+(\w+)::(\w+)/);
    const moduleName = moduleMatch ? `${moduleMatch[1]}::${moduleMatch[2]}` : 'unknown';

    let match;
    while ((match = funcRegex.exec(code)) !== null) {
      const funcName = match[1];
      const funcBody = match[2];
      const hotspots = this.findHotspots(funcBody, code.substring(0, match.index).split('\n').length);
      const gasUsed = this.estimateFunctionGas(funcBody);

      functions.push({
        name: funcName,
        module: moduleName,
        gasUsed,
        executionTime: 0,
        callCount: 0,
        bytecodeSize: funcBody.length * 2, // Rough estimate
        complexity: gasUsed > 5000 ? 'high' : gasUsed > 2000 ? 'medium' : 'low',
        hotspots,
      });
    }

    return functions;
  }

  /**
   * Find performance hotspots in function body
   */
  private findHotspots(funcBody: string, startLine: number): Hotspot[] {
    const hotspots: Hotspot[] = [];
    const lines = funcBody.split('\n');

    lines.forEach((line, idx) => {
      const lineNum = startLine + idx;
      const trimmed = line.trim().toLowerCase();

      // Loop detection
      if (trimmed.includes('while') || trimmed.includes('loop')) {
        hotspots.push({
          line: lineNum,
          operation: 'loop',
          gasCost: 1500,
          suggestion: 'Loops can be expensive. Consider bounded iterations or alternative approaches.',
        });
      }

      // Vector operations
      if (trimmed.includes('vector::') || trimmed.includes('.push_back') || trimmed.includes('.pop_back')) {
        hotspots.push({
          line: lineNum,
          operation: 'vector_operation',
          gasCost: 200,
          suggestion: 'Vector operations have O(n) complexity. Pre-allocate when possible.',
        });
      }

      // Storage operations
      if (trimmed.includes('borrow_global') || trimmed.includes('move_to') || trimmed.includes('move_from')) {
        hotspots.push({
          line: lineNum,
          operation: 'storage_access',
          gasCost: 500,
          suggestion: 'Storage operations are expensive. Cache values when accessed multiple times.',
        });
      }

      // Object creation
      if (trimmed.includes('object::new')) {
        hotspots.push({
          line: lineNum,
          operation: 'object_creation',
          gasCost: 2000,
          suggestion: 'Object creation has storage costs. Consider object pooling for frequent operations.',
        });
      }

      // Event emission
      if (trimmed.includes('event::emit')) {
        hotspots.push({
          line: lineNum,
          operation: 'event_emission',
          gasCost: 300,
          suggestion: 'Events add gas cost. Emit only essential events.',
        });
      }
    });

    return hotspots;
  }

  /**
   * Estimate gas for function body
   */
  private estimateFunctionGas(funcBody: string): number {
    let gas = 1000; // Base cost
    const body = funcBody.toLowerCase();

    // Count operations
    gas += (body.match(/while|loop|for/g) || []).length * 1500;
    gas += (body.match(/vector::|\.push_back|\.pop_back|\.length/g) || []).length * 200;
    gas += (body.match(/object::new/g) || []).length * 2000;
    gas += (body.match(/event::emit/g) || []).length * 300;
    gas += (body.match(/transfer::|public_transfer/g) || []).length * 500;
    gas += (body.match(/borrow_global|move_to|move_from/g) || []).length * 500;
    gas += (body.match(/assert!/g) || []).length * 100;

    return gas;
  }

  /**
   * Analyze overall gas usage
   */
  private analyzeGas(code: string, functions: FunctionProfile[]): GasAnalysis {
    const totalGas = functions.reduce((sum, f) => sum + f.gasUsed, 0);
    
    // Categorize gas usage
    const body = code.toLowerCase();
    const computationOps = (body.match(/while|loop|for|if|else|assert/g) || []).length;
    const storageOps = (body.match(/object::new|move_to|move_from|borrow/g) || []).length;
    const transferOps = (body.match(/transfer::|public_transfer/g) || []).length;

    const computationCost = computationOps * 200 + 500;
    const storageCost = storageOps * 1000;
    const transferCost = transferOps * 500;
    const total = computationCost + storageCost + transferCost || 1;

    return {
      totalGas,
      computationCost,
      storageCost,
      storageRebate: 0,
      breakdown: [
        { category: 'Computation', gas: computationCost, percentage: (computationCost / total) * 100 },
        { category: 'Storage', gas: storageCost, percentage: (storageCost / total) * 100 },
        { category: 'Transfers', gas: transferCost, percentage: (transferCost / total) * 100 },
      ],
    };
  }

  /**
   * Analyze memory usage patterns
   */
  private analyzeMemory(code: string): MemoryAnalysis {
    const body = code.toLowerCase();

    const objectCreations = (body.match(/object::new/g) || []).length;
    const vectorOps = (body.match(/vector::|\.push_back|\.pop_back/g) || []).length;
    const deletions = (body.match(/object::delete/g) || []).length;

    return {
      peakMemory: objectCreations * 1024 + vectorOps * 256,
      allocations: objectCreations + vectorOps,
      deallocations: deletions,
      objectsCreated: objectCreations,
      vectorOperations: vectorOps,
    };
  }

  /**
   * Enrich function profiles with real compilation data
   */
  private async enrichWithCompilation(
    code: string,
    packageName: string,
    functions: FunctionProfile[]
  ): Promise<void> {
    const projectDir = path.join(this.tempDir, `${packageName}-${Date.now()}`);

    try {
      await fs.mkdir(projectDir, { recursive: true });

      // Create Move.toml
      const moveToml = `[package]
name = "${packageName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${packageName} = "0x0"
`;
      await fs.writeFile(path.join(projectDir, 'Move.toml'), moveToml);

      const sourcesDir = path.join(projectDir, 'sources');
      await fs.mkdir(sourcesDir);
      await fs.writeFile(path.join(sourcesDir, `${packageName}.move`), code);

      // Compile to get bytecode sizes
      const { stdout } = await execAsync(`sui move build --path ${projectDir}`, {
        timeout: 60000,
      });

      // Try to read bytecode files
      const buildDir = path.join(projectDir, 'build', packageName, 'bytecode_modules');
      try {
        const files = await fs.readdir(buildDir);
        for (const file of files) {
          const content = await fs.readFile(path.join(buildDir, file));
          const funcName = file.replace('.mv', '');
          const func = functions.find((f) => f.name === funcName);
          if (func) {
            func.bytecodeSize = content.length;
          }
        }
      } catch {
        // Bytecode directory might not exist
      }
    } catch (error) {
      console.error('Compilation for profiling failed:', error);
    } finally {
      try {
        await fs.rm(projectDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Get profile by ID
   */
  getProfile(id: string): ProfileResult | null {
    return this.profiles.get(id) || null;
  }

  /**
   * Compare two profiles
   */
  compareProfiles(id1: string, id2: string): {
    gasImprovement: number;
    memoryImprovement: number;
    functionsImproved: string[];
  } | null {
    const p1 = this.profiles.get(id1);
    const p2 = this.profiles.get(id2);
    if (!p1 || !p2) return null;

    const gasImprovement = p1.gasAnalysis.totalGas - p2.gasAnalysis.totalGas;
    const memoryImprovement = p1.memoryAnalysis.peakMemory - p2.memoryAnalysis.peakMemory;

    const functionsImproved: string[] = [];
    p1.functions.forEach((f1) => {
      const f2 = p2.functions.find((f) => f.name === f1.name);
      if (f2 && f2.gasUsed < f1.gasUsed) {
        functionsImproved.push(f1.name);
      }
    });

    return { gasImprovement, memoryImprovement, functionsImproved };
  }

  /**
   * Cleanup old profiles
   */
  cleanupProfiles(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, profile] of this.profiles.entries()) {
      if (now - profile.timestamp.getTime() > maxAge) {
        this.profiles.delete(id);
      }
    }
  }
}

export const profiler = new ProfilerService();

// Cleanup every hour
setInterval(() => profiler.cleanupProfiles(), 3600000);
