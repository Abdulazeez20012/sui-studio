# Sui Studio IDE - Comprehensive Technical Report
## Part 10: Testing Strategy & Quality Assurance

---

## 10. TESTING & QUALITY ASSURANCE

### 10.1 Testing Stack

**Testing Framework: Vitest 1.6.1**

**Why Vitest:**
- Vite-native (same config, fast)
- Jest-compatible API
- Built-in TypeScript support
- Fast parallel execution
- Watch mode with HMR
- UI mode for visual testing

**Testing Libraries:**
- **@testing-library/react**: Component testing
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom matchers
- **jsdom**: Browser environment simulation

**Configuration (vitest.config.ts):**
```typescript
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
      ],
    },
  },
});
```

### 10.2 Test Categories

**1. Unit Tests**

**Purpose:** Test individual functions and components in isolation

**Example: useFileWatcher Hook Test**
```typescript
import { renderHook } from '@testing-library/react';
import { useFileWatcher } from '../hooks/useFileWatcher';

describe('useFileWatcher', () => {
  it('should start watching when folder is set', () => {
    const onFileChanged = vi.fn();
    const { result } = renderHook(() => 
      useFileWatcher({ onFileChanged })
    );
    
    expect(result.current.isWatching).toBe(true);
  });

  it('should call callback when file changes', async () => {
    const onFileChanged = vi.fn();
    renderHook(() => useFileWatcher({ onFileChanged }));
    
    // Simulate file change
    window.electron.onFileChanged('test.move');
    
    await waitFor(() => {
      expect(onFileChanged).toHaveBeenCalledWith('test.move');
    });
  });
});
```

**Example: Component Test**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { FileExplorer } from '../components/ide/FileExplorer';

describe('FileExplorer', () => {
  it('should render file tree', () => {
    const files = [
      { id: '1', name: 'test.move', type: 'file', path: '/test.move' }
    ];
    
    render(<FileExplorer files={files} />);
    
    expect(screen.getByText('test.move')).toBeInTheDocument();
  });

  it('should open file on click', async () => {
    const onFileOpen = vi.fn();
    render(<FileExplorer onFileOpen={onFileOpen} />);
    
    const file = screen.getByText('test.move');
    fireEvent.click(file);
    
    expect(onFileOpen).toHaveBeenCalledWith('/test.move');
  });
});
```

**2. Integration Tests**

**Purpose:** Test component interactions and data flow

**Example: Editor Integration Test**
```typescript
describe('Editor Integration', () => {
  it('should save file when Ctrl+S is pressed', async () => {
    const { user } = render(<IDEPage />);
    
    // Open file
    await user.click(screen.getByText('test.move'));
    
    // Edit content
    const editor = screen.getByRole('textbox');
    await user.type(editor, 'module test {}');
    
    // Save
    await user.keyboard('{Control>}s{/Control}');
    
    // Verify save
    expect(screen.getByText('File saved')).toBeInTheDocument();
  });
});
```



**3. E2E Tests (Planned)**

**Tool: Playwright**

**Example: Full Workflow Test**
```typescript
import { test, expect } from '@playwright/test';

test('complete development workflow', async ({ page }) => {
  // Launch app
  await page.goto('http://localhost:3000/ide');
  
  // Open folder
  await page.click('button:has-text("Open")');
  // ... folder selection
  
  // Create new file
  await page.click('button:has-text("New File")');
  await page.fill('input[placeholder="File name"]', 'hello.move');
  await page.press('input', 'Enter');
  
  // Write code
  await page.fill('.monaco-editor textarea', `
    module hello {
      public fun greet() {
        // Hello world
      }
    }
  `);
  
  // Save
  await page.keyboard.press('Control+S');
  await expect(page.locator('text=File saved')).toBeVisible();
  
  // Build
  await page.click('button:has-text("Build")');
  await expect(page.locator('text=Build successful')).toBeVisible();
  
  // Run tests
  await page.click('button:has-text("Test")');
  await expect(page.locator('text=Tests passed')).toBeVisible();
});
```

### 10.3 Test Coverage Goals

**Target Coverage:**
- Overall: 80%+
- Critical paths: 95%+
- UI components: 70%+
- Hooks: 90%+
- Services: 95%+

**Coverage Reports:**
```bash
npm run test:coverage
# Generates HTML report in coverage/
# Shows line, branch, function, statement coverage
```

### 10.4 Quality Assurance Practices

**1. Code Review Checklist:**
- ✅ TypeScript types defined
- ✅ Error handling implemented
- ✅ Tests written and passing
- ✅ Documentation updated
- ✅ No console.log statements
- ✅ Accessibility considered
- ✅ Performance optimized
- ✅ Security reviewed

**2. Automated Checks:**
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "validate": "npm run lint && npm run type-check && npm run test"
  }
}
```

**3. Pre-commit Hooks (Husky):**
```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run type-check
npm run test
```

**4. CI/CD Pipeline:**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v2
```

### 10.5 Performance Testing

**1. Bundle Size Monitoring:**
```bash
npm run build -- --mode analyze
# Tracks bundle size over time
# Alerts on significant increases
```

**2. Lighthouse Audits:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

**3. Load Testing:**
```typescript
// Test with large file trees
const largeFileTree = generateFileTree(1000); // 1000 files
render(<FileExplorer files={largeFileTree} />);
expect(screen.getByText('file-999.move')).toBeInTheDocument();
```

**4. Memory Leak Detection:**
```typescript
it('should not leak memory on tab close', () => {
  const { unmount } = render(<CodeEditor />);
  const initialMemory = performance.memory.usedJSHeapSize;
  
  unmount();
  
  // Force garbage collection (if available)
  if (global.gc) global.gc();
  
  const finalMemory = performance.memory.usedJSHeapSize;
  expect(finalMemory).toBeLessThanOrEqual(initialMemory * 1.1);
});
```

### 10.6 Accessibility Testing

**1. Keyboard Navigation:**
```typescript
it('should be keyboard navigable', async () => {
  const { user } = render(<FileExplorer />);
  
  // Tab through elements
  await user.tab();
  expect(screen.getByRole('button', { name: 'New File' })).toHaveFocus();
  
  await user.tab();
  expect(screen.getByRole('button', { name: 'New Folder' })).toHaveFocus();
});
```

**2. Screen Reader Support:**
```typescript
it('should have proper ARIA labels', () => {
  render(<FileExplorer />);
  
  expect(screen.getByRole('tree')).toHaveAttribute('aria-label', 'File Explorer');
  expect(screen.getByRole('treeitem')).toHaveAttribute('aria-expanded', 'false');
});
```

**3. Color Contrast:**
- WCAG AA compliance minimum
- 4.5:1 for normal text
- 3:1 for large text
- Automated testing with axe-core

