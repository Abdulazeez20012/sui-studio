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
