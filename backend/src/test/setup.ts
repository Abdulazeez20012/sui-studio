// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random available port for tests

// Increase timeout for compilation tests
jest.setTimeout(60000);

// Clean up after all tests
afterAll(async () => {
  // Give time for any pending operations to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
});
