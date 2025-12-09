/**
 * Simple compilation test without database
 * Tests the compiler service directly
 */

// Simple test cases
const tests = [
  {
    name: 'Hello World',
    code: `
module test::hello {
    use std::string;
    
    public fun hello_world(): string::String {
        string::utf8(b"Hello, World!")
    }
}
`,
    expect: 'success',
  },
  {
    name: 'Missing Module',
    code: `
public fun orphan() {}
`,
    expect: 'error',
  },
  {
    name: 'Unbalanced Braces',
    code: `
module test::broken {
    public fun test() {
        // Missing brace
}
`,
    expect: 'error',
  },
];

async function testCompile(test) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Test: ${test.name}`);
  console.log('='.repeat(50));
  
  try {
    const response = await fetch('http://localhost:3001/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: test.code,
        packageName: 'test',
      }),
    });

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      return false;
    }

    const result = await response.json();
    
    console.log(`Success: ${result.success ? '✅' : '❌'}`);
    console.log(`Mode: ${result.simulated ? 'Simulated' : 'Real'}`);
    
    if (result.success) {
      console.log(`Modules: ${result.modules?.length || 0}`);
      console.log(`Gas: ${result.gasEstimate || 'N/A'}`);
    } else if (result.errors) {
      console.log(`Errors: ${result.errors.length}`);
      result.errors.slice(0, 2).forEach(e => {
        console.log(`  - ${e.message}`);
      });
    }
    
    const passed = (test.expect === 'success') === result.success;
    console.log(`\nResult: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    
    return passed;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Compilation System\n');
  
  // Test health
  try {
    const health = await fetch('http://localhost:3001/api/compile/health');
    const data = await health.json();
    console.log('Health Check:');
    console.log(`  Sui CLI: ${data.suiCLI}`);
    console.log(`  Mode: ${data.mode}`);
    console.log(`  Status: ${data.status}\n`);
  } catch (error) {
    console.log('⚠️  Could not reach backend\n');
  }
  
  // Run tests
  let passed = 0;
  for (const test of tests) {
    if (await testCompile(test)) {
      passed++;
    }
    await new Promise(r => setTimeout(r, 500)); // Small delay
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Results: ${passed}/${tests.length} passed`);
  console.log('='.repeat(50));
  
  process.exit(passed === tests.length ? 0 : 1);
}

main().catch(console.error);
