import { describe, it, expect, beforeEach } from '@jest/globals';
import { zkLoginService } from '../zkLogin';

describe('ZkLoginService', () => {
  describe('Session Management', () => {
    it('should create a new zkLogin session', async () => {
      const session = await zkLoginService.createSession();

      expect(session).toBeDefined();
      expect(session.id).toMatch(/^zklogin_/);
      expect(session.nonce).toBeDefined();
      expect(session.maxEpoch).toBeGreaterThan(0);
      expect(session.randomness).toBeDefined();
      expect(session.ephemeralKeyPair).toBeDefined();
      expect(session.ephemeralKeyPair.publicKey).toBeDefined();
      expect(session.ephemeralKeyPair.secretKey).toBeDefined();
    });

    it('should get an existing session', async () => {
      const session = await zkLoginService.createSession();
      const retrieved = zkLoginService.getSession(session.id);

      expect(retrieved).toEqual(session);
    });

    it('should return null for non-existent session', () => {
      const retrieved = zkLoginService.getSession('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should return null for expired session', async () => {
      const session = await zkLoginService.createSession();
      
      // Manually expire the session
      session.expiresAt = new Date(Date.now() - 1000);
      
      const retrieved = zkLoginService.getSession(session.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('Salt Generation', () => {
    it('should generate a salt', () => {
      const salt = zkLoginService.generateSalt();

      expect(salt).toBeDefined();
      expect(typeof salt).toBe('string');
      expect(salt.length).toBeGreaterThan(0);
    });

    it('should generate unique salts', () => {
      const salt1 = zkLoginService.generateSalt();
      const salt2 = zkLoginService.generateSalt();

      expect(salt1).not.toBe(salt2);
    });
  });

  describe('OAuth URLs', () => {
    it('should generate Google OAuth URL', async () => {
      const session = await zkLoginService.createSession();
      const url = zkLoginService.getGoogleOAuthUrl(
        session.nonce,
        'http://localhost:3000/callback'
      );

      expect(url).toContain('accounts.google.com');
      expect(url).toContain('nonce=' + session.nonce);
      expect(url).toContain('redirect_uri=');
    });

    it('should generate Facebook OAuth URL', async () => {
      const session = await zkLoginService.createSession();
      const url = zkLoginService.getFacebookOAuthUrl(
        session.nonce,
        'http://localhost:3000/callback'
      );

      expect(url).toContain('facebook.com');
      expect(url).toContain('state=' + session.nonce);
      expect(url).toContain('redirect_uri=');
    });
  });

  describe('Session Cleanup', () => {
    it('should clean up expired sessions', async () => {
      const session1 = await zkLoginService.createSession();
      const session2 = await zkLoginService.createSession();

      // Expire session1
      session1.expiresAt = new Date(Date.now() - 1000);

      zkLoginService.cleanupExpiredSessions();

      expect(zkLoginService.getSession(session1.id)).toBeNull();
      expect(zkLoginService.getSession(session2.id)).toBeDefined();
    });
  });
});
