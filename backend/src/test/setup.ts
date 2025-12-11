// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random available port for tests

// Note: jest.setTimeout and afterAll are available in Jest test environment
// These are type-checked but will work at runtime when tests are executed
