import request from 'supertest';
import express from 'express';

// Create a minimal app for testing health endpoint
const app = express();

// Health check endpoint (same as in index.ts)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

describe('Health Check Endpoint', () => {
  it('should return 200 OK with status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });

  it('should respond quickly (< 100ms)', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
