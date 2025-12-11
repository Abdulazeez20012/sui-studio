import request from 'supertest';
import app from '../../index';

// Note: These tests require authentication. The project-init routes
// use authenticateToken middleware which validates JWT tokens.
// For comprehensive testing, you would need to:
// 1. Create a test user in the database
// 2. Generate a valid JWT token
// 3. Use that token in the Authorization header

describe('Project Initialization API', () => {
  describe('Authentication', () => {
    it('should return 401 without authentication on POST /create', async () => {
      const response = await request(app)
        .post('/api/project-init/create')
        .send({
          name: 'test-project',
          template: 'hello_world',
        });

      expect(response.status).toBe(401);
    });

    it('should return 401 without authentication on GET /templates', async () => {
      const response = await request(app)
        .get('/api/project-init/templates');

      expect(response.status).toBe(401);
    });
  });

  // Integration tests with valid authentication would go here
  // These require a running database and valid JWT tokens
  describe.skip('With Authentication (requires database)', () => {
    const validToken = 'your-valid-jwt-token';

    it('should create a new project with hello_world template', async () => {
      const response = await request(app)
        .post('/api/project-init/create')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'test-project',
          template: 'hello_world',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return list of available templates', async () => {
      const response = await request(app)
        .get('/api/project-init/templates')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
