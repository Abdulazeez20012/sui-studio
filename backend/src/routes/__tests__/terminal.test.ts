import request from 'supertest';
import express from 'express';
import terminalRouter from '../terminal';

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req: any, res, next) => {
  req.userId = 'test-user-id';
  next();
});

app.use('/api/terminal', terminalRouter);

describe('Terminal API', () => {
  describe('POST /api/terminal/execute', () => {
    it('should execute help command', async () => {
      const response = await request(app)
        .post('/api/terminal/execute')
        .send({
          command: 'help',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toContain('Available commands');
    });

    it('should execute clear command', async () => {
      const response = await request(app)
        .post('/api/terminal/execute')
        .send({
          command: 'clear',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('');
    });

    it('should simulate sui move build when Sui CLI not available', async () => {
      const response = await request(app)
        .post('/api/terminal/execute')
        .send({
          command: 'sui move build',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toContain('BUILDING MovePackage');
    });

    it('should simulate sui move test when Sui CLI not available', async () => {
      const response = await request(app)
        .post('/api/terminal/execute')
        .send({
          command: 'sui move test',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toContain('Running Move unit tests');
    });

    it('should reject non-whitelisted commands', async () => {
      const response = await request(app)
        .post('/api/terminal/execute')
        .send({
          command: 'rm -rf /',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.output).toContain('command not allowed');
    });

    it('should validate request body', async () => {
      const response = await request(app)
        .post('/api/terminal/execute')
        .send({
          // Missing command field
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/terminal/workspace', () => {
    it('should return workspace info', async () => {
      const response = await request(app).get('/api/terminal/workspace');

      expect(response.status).toBe(200);
      expect(response.body.workspaceDir).toBeDefined();
      expect(response.body.exists).toBeDefined();
    });
  });

  describe('POST /api/terminal/save-file', () => {
    it('should save file to workspace', async () => {
      const response = await request(app)
        .post('/api/terminal/save-file')
        .send({
          filename: 'test.move',
          content: 'module test {}',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.filePath).toContain('test.move');
    });

    it('should validate filename', async () => {
      const response = await request(app)
        .post('/api/terminal/save-file')
        .send({
          filename: '',
          content: 'test',
        });

      expect(response.status).toBe(400);
    });
  });
});
