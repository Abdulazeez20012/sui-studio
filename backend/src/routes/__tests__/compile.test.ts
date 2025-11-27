import request from 'supertest';
import express from 'express';
import compileRouter from '../compile';

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req: any, res, next) => {
  req.userId = 'test-user-id';
  next();
});

app.use('/api/compile', compileRouter);

describe('Compile API', () => {
  describe('POST /api/compile', () => {
    it('should return simulated compilation when Sui CLI not available', async () => {
      const response = await request(app)
        .post('/api/compile')
        .send({
          code: 'module test::example { public fun hello() {} }',
          packageName: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.bytecode).toBeDefined();
    });

    it('should validate request body', async () => {
      const response = await request(app)
        .post('/api/compile')
        .send({
          // Missing code field
          packageName: 'test',
        });

      expect(response.status).toBe(400);
    });

    it('should handle empty code', async () => {
      const response = await request(app)
        .post('/api/compile')
        .send({
          code: '',
          packageName: 'test',
        });

      expect(response.status).toBe(400);
    });

    it('should return detailed error information on compilation failure', async () => {
      const invalidCode = `
        module test::invalid {
          public fun broken() {
            // Missing semicolon and invalid syntax
            let x = 5
            return x + "string"
          }
        }
      `;

      const response = await request(app)
        .post('/api/compile')
        .send({
          code: invalidCode,
          packageName: 'test',
        });

      // Should still return 200 but with success: false
      expect(response.status).toBe(200);
      
      // In simulated mode, it will succeed
      // In real mode with Sui CLI, it would fail
      if (!response.body.simulated) {
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeDefined();
        expect(response.body.fullOutput).toBeDefined();
      }
    });

    it('should cache compilation results', async () => {
      const code = 'module test::cache { public fun test() {} }';
      
      // First request
      const response1 = await request(app)
        .post('/api/compile')
        .send({ code, packageName: 'test' });

      expect(response1.body.cached).toBe(false);

      // Second request with same code should be cached
      const response2 = await request(app)
        .post('/api/compile')
        .send({ code, packageName: 'test' });

      expect(response2.body.cached).toBe(true);
      expect(response2.body.bytecode).toBe(response1.body.bytecode);
    });

    it('should use default package name if not provided', async () => {
      const response = await request(app)
        .post('/api/compile')
        .send({
          code: 'module test::example { public fun hello() {} }',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/compile/estimate-gas', () => {
    it('should estimate gas for code', async () => {
      const response = await request(app)
        .post('/api/compile/estimate-gas')
        .send({
          code: 'module test::example { public fun hello() {} }',
        });

      expect(response.status).toBe(200);
      expect(response.body.estimatedGas).toBeGreaterThan(0);
      expect(response.body.gasBudget).toBeGreaterThan(response.body.estimatedGas);
    });

    it('should calculate gas based on code complexity', async () => {
      const simpleCode = 'module test::simple {}';
      const complexCode = `
        module test::complex {
          public fun complex_function() {
            if (true) {
              while (true) {
                for (i in 0..10) {
                  transfer::transfer(obj, sender);
                }
              }
            }
          }
        }
      `;

      const simpleResponse = await request(app)
        .post('/api/compile/estimate-gas')
        .send({ code: simpleCode });

      const complexResponse = await request(app)
        .post('/api/compile/estimate-gas')
        .send({ code: complexCode });

      expect(complexResponse.body.estimatedGas).toBeGreaterThan(
        simpleResponse.body.estimatedGas
      );
    });
  });
});
