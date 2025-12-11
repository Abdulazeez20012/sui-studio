import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { getFullnodeUrl } from '@mysten/sui/client';

export interface PTBCommand {
  id: string;
  type: 'moveCall' | 'transferObjects' | 'splitCoins' | 'mergeCoins' | 'makeMoveVec' | 'publish';
  params: any;
  result?: string;
}

export interface PTBSession {
  id: string;
  network: string;
  commands: PTBCommand[];
  gasConfig: {
    budget?: number;
    price?: number;
    payment?: string;
  };
  sender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PTBSimulationResult {
  success: boolean;
  effects?: any;
  gasUsed?: number;
  error?: string;
  events?: any[];
}

class PTBBuilderService {
  private sessions: Map<string, PTBSession> = new Map();
  private clients: Map<string, SuiClient> = new Map();

  /**
   * Get or create Sui client for network
   */
  private getClient(network: string): SuiClient {
    if (!this.clients.has(network)) {
      const url = getFullnodeUrl(network as any);
      this.clients.set(network, new SuiClient({ url }));
    }
    return this.clients.get(network)!;
  }

  /**
   * Create a new PTB session
   */
  createSession(network: string = 'testnet'): PTBSession {
    const session: PTBSession = {
      id: `ptb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      network,
      commands: [],
      gasConfig: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get PTB session
   */
  getSession(sessionId: string): PTBSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Add command to PTB
   */
  addCommand(sessionId: string, command: Omit<PTBCommand, 'id'>): PTBSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const newCommand: PTBCommand = {
      ...command,
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    session.commands.push(newCommand);
    session.updatedAt = new Date();

    return session;
  }

  /**
   * Remove command from PTB
   */
  removeCommand(sessionId: string, commandId: string): PTBSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.commands = session.commands.filter(cmd => cmd.id !== commandId);
    session.updatedAt = new Date();

    return session;
  }

  /**
   * Update command in PTB
   */
  updateCommand(sessionId: string, commandId: string, updates: Partial<PTBCommand>): PTBSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const commandIndex = session.commands.findIndex(cmd => cmd.id === commandId);
    if (commandIndex === -1) {
      throw new Error('Command not found');
    }

    session.commands[commandIndex] = {
      ...session.commands[commandIndex],
      ...updates,
    };
    session.updatedAt = new Date();

    return session;
  }

  /**
   * Build transaction from PTB session
   */
  async buildTransaction(sessionId: string): Promise<{ transaction: Transaction; bytes: Uint8Array }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const tx = new Transaction();

    // Set gas config
    if (session.gasConfig.budget) {
      tx.setGasBudget(session.gasConfig.budget);
    }
    if (session.sender) {
      tx.setSender(session.sender);
    }

    // Build commands
    for (const command of session.commands) {
      await this.buildCommand(tx, command);
    }

    // Serialize transaction
    const bytes = await tx.build({ client: this.getClient(session.network) });

    return { transaction: tx, bytes };
  }

  /**
   * Build individual command
   */
  private async buildCommand(tx: Transaction, command: PTBCommand): Promise<void> {
    switch (command.type) {
      case 'moveCall':
        tx.moveCall({
          target: command.params.target,
          arguments: command.params.arguments || [],
          typeArguments: command.params.typeArguments || [],
        });
        break;

      case 'transferObjects':
        tx.transferObjects(
          command.params.objects,
          command.params.recipient
        );
        break;

      case 'splitCoins':
        tx.splitCoins(
          command.params.coin,
          command.params.amounts
        );
        break;

      case 'mergeCoins':
        tx.mergeCoins(
          command.params.destination,
          command.params.sources
        );
        break;

      case 'makeMoveVec':
        tx.makeMoveVec({
          type: command.params.type,
          elements: command.params.elements,
        });
        break;

      case 'publish':
        tx.publish({
          modules: command.params.modules,
          dependencies: command.params.dependencies,
        });
        break;

      default:
        throw new Error(`Unknown command type: ${command.type}`);
    }
  }

  /**
   * Simulate PTB execution
   */
  async simulateTransaction(sessionId: string, sender: string): Promise<PTBSimulationResult> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      const client = this.getClient(session.network);
      const { transaction, bytes } = await this.buildTransaction(sessionId);

      // Dry run transaction
      const result = await client.dryRunTransactionBlock({
        transactionBlock: bytes,
      });

      return {
        success: result.effects.status.status === 'success',
        effects: result.effects,
        gasUsed: parseInt(result.effects.gasUsed.computationCost) +
                 parseInt(result.effects.gasUsed.storageCost),
        events: result.events,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Estimate gas for PTB
   */
  async estimateGas(sessionId: string, sender: string): Promise<number> {
    const simulation = await this.simulateTransaction(sessionId, sender);
    return simulation.gasUsed || 0;
  }

  /**
   * Export PTB as JSON
   */
  exportSession(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return JSON.stringify(session, null, 2);
  }

  /**
   * Import PTB from JSON
   */
  importSession(json: string): PTBSession {
    const session = JSON.parse(json) as PTBSession;
    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get all sessions
   */
  getAllSessions(): PTBSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Delete session
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Clear all sessions
   */
  clearSessions(): void {
    this.sessions.clear();
  }
}

export const ptbBuilderService = new PTBBuilderService();
