# 🧪 Comprehensive Testing Plan

## Overview

Professional end-to-end testing suite for Sui Studio covering:
- Backend API endpoints
- Frontend UI components
- Integration between frontend and backend
- WebSocket connections
- Database operations
- Authentication flows

---

## 📋 Testing Strategy

### 1. Backend Testing (Jest + Supertest)
- Unit tests for services
- Integration tests for API routes
- Database tests with test database
- WebSocket connection tests
- Authentication middleware tests

### 2. Frontend Testing (Vitest + React Testing Library)
- Component unit tests
- Integration tests for services
- UI interaction tests
- Hook tests
- Store tests

### 3. E2E Testing (Playwright - Optional)
- Full user workflows
- Cross-browser testing
- Visual regression testing

---

## 🎯 Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| Backend Services | 80%+ |
| Backend Routes | 90%+ |
| Frontend Components | 70%+ |
| Frontend Services | 80%+ |
| Integration Tests | Key flows |

---

## 📝 Test Implementation Plan

### Phase 1: Backend API Tests (Priority: HIGH)
1. Health check endpoint
2. Auth endpoints (register, login, logout)
3. Project endpoints (CRUD operations)
4. Compilation endpoints
5. Deployment endpoints
6. AI endpoints
7. Git operations
8. Terminal operations
9. WebSocket connections

### Phase 2: Frontend Component Tests (Priority: MEDIUM)
1. Landing page components
2. IDE components
3. Auth modals
4. Code editor
5. File explorer
6. Terminal
7. Settings panels

### Phase 3: Integration Tests (Priority: HIGH)
1. Frontend → Backend API calls
2. WebSocket real-time updates
3. Authentication flow
4. Project creation workflow
5. Code compilation workflow
6. Deployment workflow

---

## 🚀 Quick Start

### Run All Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test

# Watch mode (development)
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## 📊 Test Files Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── __tests__/
│   │       ├── auth.test.ts
│   │       ├── projects.test.ts
│   │       ├── compile.test.ts
│   │       ├── deploy.test.ts
│   │       ├── ai.test.ts
│   │       ├── git.test.ts
│   │       └── terminal.test.ts
│   ├── services/
│   │   └── __tests__/
│   │       ├── suiCompiler.test.ts
│   │       ├── gitService.test.ts
│   │       └── aiService.test.ts
│   └── middleware/
│       └── __tests__/
│           └── auth.test.ts

src/
├── services/
│   └── __tests__/
│       ├── apiService.test.ts
│       ├── compilerService.test.ts
│       ├── deploymentService.test.ts
│       └── walrusService.test.ts
├── components/
│   └── __tests__/
│       ├── LandingPage.test.tsx
│       ├── IDEPage.test.tsx
│       ├── CodeEditor.test.tsx
│       └── FileExplorer.test.tsx
└── hooks/
    └── __tests__/
        ├── useWallet.test.ts
        └── useCollaboration.test.ts
```

---

## 🔧 Test Configuration

### Backend (Jest)
```javascript
// backend/jest.config.js
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
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Frontend (Vitest)
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

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
        '**/mockData',
        'dist/'
      ]
    }
  }
});
```

---

## 📝 Test Examples

### Backend API Test Example
```typescript
// backend/src/routes/__tests__/health.test.ts
import request from 'supertest';
import app from '../../index';

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});
```

### Frontend Component Test Example
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Test Example
```typescript
// src/services/__tests__/integration.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { apiService } from '../apiService';

describe('API Integration', () => {
  beforeAll(() => {
    // Setup test environment
  });

  it('should create and fetch project', async () => {
    const project = await apiService.createProject({
      name: 'Test Project',
      template: 'basic'
    });
    
    expect(project).toHaveProperty('id');
    
    const fetched = await apiService.getProject(project.id);
    expect(fetched.name).toBe('Test Project');
  });
});
```

---

## 🎯 Critical Test Scenarios

### 1. Authentication Flow
- [ ] User registration
- [ ] User login
- [ ] Token validation
- [ ] Protected route access
- [ ] Logout

### 2. Project Management
- [ ] Create project
- [ ] List projects
- [ ] Get project details
- [ ] Update project
- [ ] Delete project

### 3. Code Compilation
- [ ] Compile valid Move code
- [ ] Handle compilation errors
- [ ] Return compilation results
- [ ] Handle timeout

### 4. Deployment
- [ ] Deploy to Sui network
- [ ] Handle deployment errors
- [ ] Return transaction details

### 5. Real-time Collaboration
- [ ] WebSocket connection
- [ ] Send/receive messages
- [ ] Multiple users
- [ ] Disconnect handling

### 6. UI Components
- [ ] Landing page loads
- [ ] IDE page loads
- [ ] Code editor works
- [ ] File explorer works
- [ ] Terminal works

---

## 🔍 Test Execution Plan

### Day 1: Backend Core Tests
- Health check
- Auth endpoints
- Project CRUD
- Database operations

### Day 2: Backend Advanced Tests
- Compilation service
- Deployment service
- Git operations
- Terminal operations

### Day 3: Frontend Component Tests
- Landing page
- IDE components
- Auth components
- Common UI elements

### Day 4: Integration Tests
- API integration
- WebSocket integration
- End-to-end workflows

### Day 5: Bug Fixes & Coverage
- Fix failing tests
- Improve coverage
- Document issues

---

## 📊 Test Reporting

### Generate Reports

```bash
# Backend coverage
cd backend
npm test -- --coverage
open coverage/index.html

# Frontend coverage
npm test -- --coverage
open coverage/index.html
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

## 🆘 Troubleshooting

### Common Issues

**Tests timing out:**
- Increase timeout in test config
- Check for async operations not being awaited

**Database connection errors:**
- Ensure test database is running
- Check connection string in test env

**Mock data issues:**
- Verify mock data structure
- Check for outdated mocks

---

## 📚 Next Steps

1. Review existing tests
2. Implement missing tests
3. Run full test suite
4. Fix failing tests
5. Improve coverage
6. Document test results

---

**Let's build a robust, well-tested application!** 🚀
