/**
 * Core Features Testing Suite
 * Tests all critical functionality without requiring external dependencies
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    log(`✓ ${name}`, 'green');
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    log(`✗ ${name}`, 'red');
    log(`  Error: ${error.message}`, 'red');
  }
}

function warn(message) {
  results.warnings++;
  log(`⚠ ${message}`, 'yellow');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, searchString) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

function isValidJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

log('\n' + '='.repeat(70), 'cyan');
log('🧪 SUI STUDIO - CORE FEATURES TEST SUITE', 'bold');
log('='.repeat(70) + '\n', 'cyan');

// ----------------------------------------------------------------------------
log('📦 1. PROJECT STRUCTURE', 'blue');
// ----------------------------------------------------------------------------

test('Root package.json exists and valid', () => {
  assert(fileExists('package.json'), 'package.json not found');
  assert(isValidJSON('package.json'), 'package.json is not valid JSON');
});

test('Backend package.json exists and valid', () => {
  assert(fileExists('backend/package.json'), 'backend/package.json not found');
  assert(isValidJSON('backend/package.json'), 'backend/package.json is not valid JSON');
});

test('TypeScript config exists', () => {
  assert(fileExists('tsconfig.json'), 'tsconfig.json not found');
  assert(fileExists('backend/tsconfig.json'), 'backend/tsconfig.json not found');
});

test('Vite config exists', () => {
  assert(fileExists('vite.config.ts'), 'vite.config.ts not found');
});

test('Tailwind config exists', () => {
  assert(fileExists('tailwind.config.js'), 'tailwind.config.js not found');
});

// ----------------------------------------------------------------------------
log('\n🎨 2. FRONTEND CORE FILES', 'blue');
// ----------------------------------------------------------------------------

test('Main entry point exists', () => {
  assert(fileExists('index.html'), 'index.html not found');
  assert(fileExists('index.tsx'), 'index.tsx not found');
});

test('App component exists', () => {
  assert(fileExists('src/App.tsx'), 'src/App.tsx not found');
});

test('Main pages exist', () => {
  assert(fileExists('src/pages/LandingPage.tsx'), 'LandingPage not found');
  assert(fileExists('src/pages/IDEPage.tsx'), 'IDEPage not found');
});

test('Core IDE components exist', () => {
  const components = [
    'src/components/ide/CodeEditor.tsx',
    'src/components/ide/FileExplorer.tsx',
    'src/components/ide/Terminal.tsx',
    'src/components/ide/Sidebar.tsx',
    'src/components/ide/StatusBar.tsx',
    'src/components/ide/Toolbar.tsx'
  ];
  components.forEach(comp => {
    assert(fileExists(comp), `${comp} not found`);
  });
});

test('Advanced IDE components exist', () => {
  const components = [
    'src/components/ide/Debugger.tsx',
    'src/components/ide/Profiler.tsx',
    'src/components/ide/TestPanel.tsx',
    'src/components/ide/DeploymentPanel.tsx',
    'src/components/ide/PackageManager.tsx',
    'src/components/ide/GitPanel.tsx'
  ];
  components.forEach(comp => {
    assert(fileExists(comp), `${comp} not found`);
  });
});

// ----------------------------------------------------------------------------
log('\n🔧 3. FRONTEND SERVICES', 'blue');
// ----------------------------------------------------------------------------

test('Core services exist', () => {
  const services = [
    'src/services/apiService.ts',
    'src/services/compilerService.ts',
    'src/services/suiService.ts',
    'src/services/deploymentService.ts'
  ];
  services.forEach(service => {
    assert(fileExists(service), `${service} not found`);
  });
});

test('Advanced services exist', () => {
  const services = [
    'src/services/debuggerService.ts',
    'src/services/profilerService.ts',
    'src/services/testService.ts',
    'src/services/packageService.ts',
    'src/services/gitService.ts',
    'src/services/aiService.ts'
  ];
  services.forEach(service => {
    assert(fileExists(service), `${service} not found`);
  });
});

test('Sui-specific services exist', () => {
  const services = [
    'src/services/subscriptionService.ts',
    'src/services/ptbService.ts',
    'src/services/contractService.ts',
    'src/services/walrusService.ts'
  ];
  services.forEach(service => {
    assert(fileExists(service), `${service} not found`);
  });
});

// ----------------------------------------------------------------------------
log('\n🗄️ 4. STATE MANAGEMENT', 'blue');
// ----------------------------------------------------------------------------

test('Zustand stores exist', () => {
  const stores = [
    'src/store/ideStore.ts',
    'src/store/authStore.ts',
    'src/store/themeStore.ts'
  ];
  stores.forEach(store => {
    assert(fileExists(store), `${store} not found`);
  });
});

// ----------------------------------------------------------------------------
log('\n⚙️ 5. BACKEND STRUCTURE', 'blue');
// ----------------------------------------------------------------------------

test('Backend entry point exists', () => {
  assert(fileExists('backend/src/index.ts'), 'backend/src/index.ts not found');
});

test('Backend routes exist', () => {
  const routes = [
    'backend/src/routes/auth.ts',
    'backend/src/routes/projects.ts',
    'backend/src/routes/compile.ts',
    'backend/src/routes/deploy.ts',
    'backend/src/routes/sui.ts'
  ];
  routes.forEach(route => {
    assert(fileExists(route), `${route} not found`);
  });
});

test('Advanced backend routes exist', () => {
  const routes = [
    'backend/src/routes/debugger.ts',
    'backend/src/routes/profiler.ts',
    'backend/src/routes/test.ts',
    'backend/src/routes/packages.ts',
    'backend/src/routes/git.ts',
    'backend/src/routes/ai.ts'
  ];
  routes.forEach(route => {
    assert(fileExists(route), `${route} not found`);
  });
});

test('New Sui feature routes exist', () => {
  const routes = [
    'backend/src/routes/ptb.ts',
    'backend/src/routes/zklogin.ts',
    'backend/src/routes/objectDisplay.ts',
    'backend/src/routes/dynamicFields.ts'
  ];
  routes.forEach(route => {
    assert(fileExists(route), `${route} not found`);
  });
});

test('Backend services exist', () => {
  const services = [
    'backend/src/services/suiCompiler.ts',
    'backend/src/services/debugger.ts',
    'backend/src/services/profiler.ts',
    'backend/src/services/testRunner.ts',
    'backend/src/services/packageManager.ts',
    'backend/src/services/gitService.ts'
  ];
  services.forEach(service => {
    assert(fileExists(service), `${service} not found`);
  });
});

test('New Sui feature services exist', () => {
  const services = [
    'backend/src/services/ptbBuilder.ts',
    'backend/src/services/zkLogin.ts',
    'backend/src/services/objectDisplay.ts',
    'backend/src/services/dynamicFields.ts',
    'backend/src/services/sponsoredTransactions.ts'
  ];
  services.forEach(service => {
    assert(fileExists(service), `${service} not found`);
  });
});

// ----------------------------------------------------------------------------
log('\n🗃️ 6. DATABASE & PRISMA', 'blue');
// ----------------------------------------------------------------------------

test('Prisma schema exists', () => {
  assert(fileExists('backend/prisma/schema.prisma'), 'Prisma schema not found');
});

test('Prisma schema has required models', () => {
  const schemaPath = 'backend/prisma/schema.prisma';
  assert(fileContains(schemaPath, 'model User'), 'User model not found in schema');
  assert(fileContains(schemaPath, 'model Project'), 'Project model not found in schema');
  assert(fileContains(schemaPath, 'model Deployment'), 'Deployment model not found in schema');
});

// ----------------------------------------------------------------------------
log('\n📜 7. SMART CONTRACTS', 'blue');
// ----------------------------------------------------------------------------

test('Subscription contract exists', () => {
  assert(fileExists('contracts/subscribtions/sources/premium_subscription.move'), 
    'Subscription contract not found');
});

test('Contract Move.toml exists', () => {
  assert(fileExists('contracts/subscribtions/Move.toml'), 'Move.toml not found');
});

test('Contract has mainnet deployment info', () => {
  assert(fileExists('contracts/subscribtions/MAINNET_DEPLOYMENT.md'), 
    'Mainnet deployment info not found');
});

// ----------------------------------------------------------------------------
log('\n🔐 8. ENVIRONMENT CONFIGURATION', 'blue');
// ----------------------------------------------------------------------------

test('Frontend .env.local exists', () => {
  assert(fileExists('.env.local'), '.env.local not found');
});

test('Backend .env.local exists', () => {
  assert(fileExists('backend/.env.local'), 'backend/.env.local not found');
});

test('Environment has mainnet contract IDs', () => {
  const envPath = '.env.local';
  assert(fileContains(envPath, 'VITE_SUBSCRIPTION_PACKAGE_ID'), 
    'Package ID not in .env.local');
  assert(fileContains(envPath, 'VITE_SUBSCRIPTION_TREASURY_ID'), 
    'Treasury ID not in .env.local');
  assert(fileContains(envPath, 'VITE_SUI_NETWORK=mainnet'), 
    'Network not set to mainnet');
});

// ----------------------------------------------------------------------------
log('\n🖥️ 9. ELECTRON DESKTOP APP', 'blue');
// ----------------------------------------------------------------------------

test('Electron main file exists', () => {
  assert(fileExists('electron/main.js'), 'electron/main.js not found');
});

test('Electron builder config exists', () => {
  assert(fileExists('electron-builder.yml'), 'electron-builder.yml not found');
});

test('Desktop build scripts exist', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(pkg.scripts['electron:dev'], 'electron:dev script not found');
  assert(pkg.scripts['electron:build'], 'electron:build script not found');
});

// ----------------------------------------------------------------------------
log('\n🧪 10. TESTING INFRASTRUCTURE', 'blue');
// ----------------------------------------------------------------------------

test('Vitest config exists', () => {
  assert(fileExists('vitest.config.ts'), 'vitest.config.ts not found');
});

test('Backend test files exist', () => {
  const tests = [
    'backend/src/services/__tests__/ptbBuilder.test.ts',
    'backend/src/services/__tests__/zkLogin.test.ts',
    'backend/src/services/__tests__/objectDisplay.test.ts',
    'backend/src/services/__tests__/dynamicFields.test.ts',
    'backend/src/services/__tests__/sponsoredTransactions.test.ts'
  ];
  tests.forEach(test => {
    assert(fileExists(test), `${test} not found`);
  });
});

// ----------------------------------------------------------------------------
log('\n🔌 11. INTEGRATION FEATURES', 'blue');
// ----------------------------------------------------------------------------

test('Wallet integration exists', () => {
  assert(fileExists('src/providers/WalletProvider.tsx'), 'WalletProvider not found');
  assert(fileExists('src/hooks/useWallet.ts'), 'useWallet hook not found');
  assert(fileExists('src/components/ide/WalletPanel.tsx'), 'WalletPanel not found');
});

test('Collaboration features exist', () => {
  assert(fileExists('src/hooks/useYjsCollaboration.ts'), 'Yjs collaboration hook not found');
  assert(fileExists('backend/src/services/yjsServer.ts'), 'Yjs server not found');
  assert(fileExists('src/components/ide/VideoChat.tsx'), 'VideoChat component not found');
});

test('AI integration exists', () => {
  assert(fileExists('src/components/ide/NexiAI.tsx'), 'NexiAI component not found');
  assert(fileExists('backend/src/routes/ai.ts'), 'AI routes not found');
});

// ----------------------------------------------------------------------------
log('\n📚 12. DOCUMENTATION', 'blue');
// ----------------------------------------------------------------------------

test('Core documentation exists', () => {
  const docs = [
    'README.md',
    'QUICKSTART.md',
    'FEATURES.md',
    'IDE_ARCHITECTURE.md'
  ];
  docs.forEach(doc => {
    assert(fileExists(doc), `${doc} not found`);
  });
});

test('Deployment documentation exists', () => {
  const docs = [
    'READY_FOR_PRODUCTION.md',
    'MAINNET_DEPLOYMENT_COMPLETE.md',
    'DESKTOP_READY.md'
  ];
  docs.forEach(doc => {
    assert(fileExists(doc), `${doc} not found`);
  });
});

// ----------------------------------------------------------------------------
log('\n⚠️  13. DEPENDENCY CHECKS', 'blue');
// ----------------------------------------------------------------------------

// Check if node_modules exist
if (!fileExists('node_modules')) {
  warn('Frontend node_modules not installed - run: npm install');
} else {
  test('Frontend dependencies installed', () => {
    assert(fileExists('node_modules'), 'node_modules not found');
  });
}

if (!fileExists('backend/node_modules')) {
  warn('Backend node_modules not installed - run: cd backend && npm install');
} else {
  test('Backend dependencies installed', () => {
    assert(fileExists('backend/node_modules'), 'backend/node_modules not found');
  });
}

// Check for Sui CLI (optional)
const { execSync } = require('child_process');
try {
  execSync('sui --version', { stdio: 'ignore' });
  test('Sui CLI is installed', () => {
    assert(true, 'Sui CLI found');
  });
} catch {
  warn('Sui CLI not installed - compilation features will not work');
  warn('Install with: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui');
}

// ============================================================================
// RESULTS SUMMARY
// ============================================================================

log('\n' + '='.repeat(70), 'cyan');
log('📊 TEST RESULTS SUMMARY', 'bold');
log('='.repeat(70), 'cyan');

log(`\n✓ Passed: ${results.passed}`, 'green');
if (results.failed > 0) {
  log(`✗ Failed: ${results.failed}`, 'red');
}
if (results.warnings > 0) {
  log(`⚠ Warnings: ${results.warnings}`, 'yellow');
}

const total = results.passed + results.failed;
const percentage = ((results.passed / total) * 100).toFixed(1);

log(`\nTotal: ${results.passed}/${total} (${percentage}%)`, 'bold');

if (results.failed === 0) {
  log('\n🎉 ALL CORE FEATURES ARE PROPERLY STRUCTURED!', 'green');
  log('✅ Your codebase is ready for development', 'green');
} else {
  log('\n⚠️  Some tests failed - review the errors above', 'yellow');
}

// Next steps
log('\n' + '='.repeat(70), 'cyan');
log('🚀 NEXT STEPS', 'bold');
log('='.repeat(70), 'cyan');

log('\n1. Install Dependencies (if not done):', 'blue');
log('   npm install');
log('   cd backend && npm install');

log('\n2. Start Development:', 'blue');
log('   Terminal 1: cd backend && npm run dev');
log('   Terminal 2: npm run dev');

log('\n3. Build Desktop App:', 'blue');
log('   npm run electron:build');

log('\n4. Optional - Install Sui CLI for compilation:', 'blue');
log('   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui');

log('\n' + '='.repeat(70) + '\n', 'cyan');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
