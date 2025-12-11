import { describe, it, expect, beforeEach } from '@jest/globals';
import { ptbBuilderService } from '../ptbBuilder';

describe('PTBBuilderService', () => {
  beforeEach(() => {
    ptbBuilderService.clearSessions();
  });

  describe('Session Management', () => {
    it('should create a new PTB session', () => {
      const session = ptbBuilderService.createSession('testnet');

      expect(session).toBeDefined();
      expect(session.id).toMatch(/^ptb_/);
      expect(session.network).toBe('testnet');
      expect(session.commands).toEqual([]);
      expect(session.gasConfig).toEqual({});
    });

    it('should get an existing session', () => {
      const session = ptbBuilderService.createSession('testnet');
      const retrieved = ptbBuilderService.getSession(session.id);

      expect(retrieved).toEqual(session);
    });

    it('should return null for non-existent session', () => {
      const retrieved = ptbBuilderService.getSession('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should delete a session', () => {
      const session = ptbBuilderService.createSession('testnet');
      const deleted = ptbBuilderService.deleteSession(session.id);

      expect(deleted).toBe(true);
      expect(ptbBuilderService.getSession(session.id)).toBeNull();
    });

    it('should get all sessions', () => {
      ptbBuilderService.createSession('testnet');
      ptbBuilderService.createSession('mainnet');

      const sessions = ptbBuilderService.getAllSessions();
      expect(sessions).toHaveLength(2);
    });
  });

  describe('Command Management', () => {
    it('should add a command to PTB', () => {
      const session = ptbBuilderService.createSession('testnet');
      
      const updated = ptbBuilderService.addCommand(session.id, {
        type: 'moveCall',
        params: {
          target: '0x2::coin::split',
          arguments: [],
        },
      });

      expect(updated.commands).toHaveLength(1);
      expect(updated.commands[0].type).toBe('moveCall');
      expect(updated.commands[0].id).toMatch(/^cmd_/);
    });

    it('should remove a command from PTB', () => {
      const session = ptbBuilderService.createSession('testnet');
      const updated = ptbBuilderService.addCommand(session.id, {
        type: 'moveCall',
        params: { target: '0x2::coin::split' },
      });

      const commandId = updated.commands[0].id;
      const removed = ptbBuilderService.removeCommand(session.id, commandId);

      expect(removed.commands).toHaveLength(0);
    });

    it('should update a command in PTB', () => {
      const session = ptbBuilderService.createSession('testnet');
      const updated = ptbBuilderService.addCommand(session.id, {
        type: 'moveCall',
        params: { target: '0x2::coin::split' },
      });

      const commandId = updated.commands[0].id;
      const modified = ptbBuilderService.updateCommand(session.id, commandId, {
        params: { target: '0x2::coin::merge' },
      });

      expect(modified.commands[0].params.target).toBe('0x2::coin::merge');
    });

    it('should throw error when adding command to non-existent session', () => {
      expect(() => {
        ptbBuilderService.addCommand('non-existent', {
          type: 'moveCall',
          params: {},
        });
      }).toThrow('Session not found');
    });
  });

  describe('Export/Import', () => {
    it('should export session as JSON', () => {
      const session = ptbBuilderService.createSession('testnet');
      ptbBuilderService.addCommand(session.id, {
        type: 'moveCall',
        params: { target: '0x2::coin::split' },
      });

      const json = ptbBuilderService.exportSession(session.id);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(session.id);
      expect(parsed.commands).toHaveLength(1);
    });

    it('should import session from JSON', () => {
      const session = ptbBuilderService.createSession('testnet');
      const json = ptbBuilderService.exportSession(session.id);

      ptbBuilderService.clearSessions();
      const imported = ptbBuilderService.importSession(json);

      expect(imported.id).toBe(session.id);
    });
  });
});
