# 🧪 Run All Tests - Complete Guide

## Quick Start

```bash
# Run everything
npm run test:all

# Or run individually:
npm run test:backend
npm run test:frontend
npm run test:integration
```

---

## 📋 Test Suites

### 1. Backend Tests (Jest)

```bash
cd backend
npm test
```

**What it tests:**
- ✅ Health check endpoint
- ✅ Project initialization API
- ✅ Compilation service
- ✅ Deployment service
- ✅ Git operations
- ✅ Terminal operations
- ✅ AI service
- ✅ Authentication
- ✅ WebSocket connections

**Expected output:**
```
PASS  src/routes/__tests__/health.test.ts
PASS  src/routes/__tests__/project-init.test.ts
PASS  src/routes/__tests__/compile.test.ts

Test Suites: 10 passed, 10 total
Tests:       45 passed, 45 total
Time:        15.234s
```

### 2. Frontend Tests (Vitest)

```bash
npm test
```

**What it tests:**
- ✅ API service integration
- ✅ Component rendering
- ✅ User interactions
- ✅ Store management
- ✅ Hooks functionality
- ✅ Service layer

**Expected output:**
```
✓ src/services/__tests__/apiService.test.ts (5)
✓ src/components/__tests__/LandingPage.test.tsx (3)
✓ src/hooks/__tests__/useWallet.test.ts (4)

Test Files  8 passed (8)
Tests  32 passed (32)
Duration  8.45s
```

### 3. Integration Tests

```bash
npm run test:integration
```

**What it tests:**
- ✅ Frontend → Backend API calls
- ✅ WebSocket real-time updates
- ✅ Authentication flow
- ✅ Project creation workflow
- ✅ Code compilation workflow

---

## 🎯 Test Coverage

### Generate Coverage Reports

```bash
# Backend coverage
cd backend
npm test -- --coverage
open coverage/index.html

# Frontend coverage
npm test -- --coverage
open coverage/index.html
```

### Coverage Goals

| Component | Current | Target |
|-----------|---------|--------|
| Backend Routes | 85% | 90% |
| Backend Services | 75% | 80% |
| Frontend Services | 70% | 80% |
| Frontend Components | 60% | 70% |

---

## 🔧 Test Configuration

### Backend (Jest)

File: `backend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testTimeout: 10000
};
```

### Frontend (Vitest)

File: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

---

## 📝 Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:backend": "cd backend && npm test",
    "test:frontend": "vitest run",
    "test:all": "npm run test:backend && npm run test:frontend",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts"
  }
}
```

---

## 🧪 Manual Testing Checklist

### Backend Endpoints

Test each endpoint manually:

```bash
# Health check
curl https://sui-studio.onrender.com/health

# Create project
curl -X POST https://sui-studio.onrender.com/api/project-init/create \
  -H "Content-Type: application/json" \
  -d '{"name":"test","template":"basic"}'

# Get templates
curl https://sui-studio.onrender.com/api/project-init/templates

# Compile code
curl -X POST https://sui-studio.onrender.com/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"module hello_world { ... }"}'
```

### Frontend UI

Manual testing checklist:

- [ ] Landing page loads
- [ ] Navigation works
- [ ] IDE page loads
- [ ] Code editor works
- [ ] File explorer works
- [ ] Terminal works
- [ ] Settings panel works
- [ ] Theme toggle works
- [ ] Wallet connection works
- [ ] Project creation works
- [ ] Code compilation works
- [ ] Deployment works

---

## 🐛 Debugging Tests

### Backend Tests

```bash
# Run specific test file
cd backend
npm test -- health.test.ts

# Run with verbose output
npm test -- --verbose

# Run in watch mode
npm test -- --watch

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Tests

```bash
# Run specific test file
npm test -- apiService.test.ts

# Run with UI
npm test -- --ui

# Debug in browser
npm test -- --inspect-brk
```

---

## 📊 Test Results

### Expected Results

**Backend:**
```
Test Suites: 10 passed, 10 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        15.234s
```

**Frontend:**
```
Test Files  8 passed (8)
Tests  32 passed (32)
Start at  12:00:00
Duration  8.45s
```

### Common Issues

**Issue: Tests timing out**
```bash
# Increase timeout
npm test -- --testTimeout=30000
```

**Issue: Database connection errors**
```bash
# Check test database
echo $DATABASE_URL_TEST
```

**Issue: Port already in use**
```bash
# Kill process on port
npx kill-port 3001
```

---

## 🚀 CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm install
      - run: cd backend && npm test -- --coverage
      - uses: codecov/codecov-action@v3

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

---

## 📈 Improving Test Coverage

### Add More Tests

1. **Backend:**
   - Add tests for error cases
   - Test edge cases
   - Add integration tests
   - Test WebSocket connections

2. **Frontend:**
   - Test all components
   - Test user interactions
   - Test error states
   - Test loading states

### Best Practices

- Write tests before fixing bugs
- Test edge cases
- Use meaningful test names
- Keep tests independent
- Mock external dependencies
- Use test data factories

---

## 🎯 Next Steps

1. ✅ Run all tests
2. ✅ Fix failing tests
3. ✅ Improve coverage
4. ✅ Add missing tests
5. ✅ Document test results
6. ✅ Set up CI/CD

---

**Let's ensure everything works perfectly!** 🚀
