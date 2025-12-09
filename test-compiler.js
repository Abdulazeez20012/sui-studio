/**
 * Test script for the compilation system
 * Run with: node test-compiler.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Test cases
const testCases = [
  {
    name: 'Valid Hello World Module',
    code: `
module test::hello {
    use std::string;
    
    public fun hello_world(): string::String {
        string::utf8(b"Hello, World!")
    }
}
`,
    shouldSucceed: true,
  },
  {
    name: 'Invalid Syntax - Missing Brace',
    code: `
module test::broken {
    public fun test() {
        // Missing closing brace
}
`,
    shouldSucceed: false,
  },
  {
    name: 'Missing Module Declaration',
    code: `
public fun orphan() {
    // No module
}
`,
    shouldSucceed: false,
  },
  {
    name: 'Complex Module with Struct',
    code: `
module test::complex {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    
    struct Item has key, store {
        id: UID,
        value: u64,
    }
    
    public fun create_item(value: u64, ctx: &mut TxContext): Item {
        Item {
            id: object::new(ctx),
            value,
        }
    }
}
`,
    shouldSucceed: true,
  },
];

async function testCompilation(testCase) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${testCase.name}`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    const response = await fetch(`${API_URL}/api/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCase.code,
        packageName: 'test',
      }),
    });

    const result = await response.json();
    
    console.log('\n📊 Result:');
    console.log(`  Success: ${result.success ? '✅' : '❌'}`);
    console.log(`  Simulated: ${result.simulated ? 'Yes' : 'No'}`);
    console.log(`  Cached: ${result.cached ? 'Yes' : 'No'}`);
    
    if (result.success) {
      console.log(`  Modules: ${result.modules?.length || 0}`);
      console.log(`  Gas Estimate: ${result.gasEstimate || 'N/A'}`);
      console.log(`  Dependencies: ${result.dependencies?.length || 0}`);
      
      if (result.warnings && result.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
        result.warnings.forEach((w, i) => {
          console.log(`  ${i + 1}. ${w.message}`);
        });
      }
      
      if (result.buildInfo) {
        console.log(`\n📦 Build Info:`);
        console.log(`  Package: ${result.buildInfo.packageName}`);
        console.log(`  Version: ${result.buildInfo.version}`);
        console.log(`  Compilation Time: ${result.buildInfo.compilationTime}ms`);
      }
    } else {
      console.log(`\n❌ Errors (${result.errors?.length || 0}):`);
      result.errors?.forEach((error, i) => {
        console.log(`\n  ${i + 1}. ${error.message}`);
        if (error.file) {
          console.log(`     Location: ${error.file}:${error.line}:${error.column}`);
        }
        if (error.code) {
          console.log(`     Code: ${error.code}`);
        }
        if (error.suggestion) {
          console.log(`     💡 Suggestion: ${error.suggestion}`);
        }
      });
    }
    
    // Verify expectation
    const passed = result.success === testCase.shouldSucceed;
    console.log(`\n${passed ? '✅ PASSED' : '❌ FAILED'}: Expected ${testCase.shouldSucceed ? 'success' : 'failure'}, got ${result.success ? 'success' : 'failure'}`);
    
    return passed;
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    return false;
  }
}

async function testHealth() {
  console.log('\n' + '='.repeat(60));
  console.log('Testing Compiler Health');
  console.log('='.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/api/compile/health`);
    const health = await response.json();
    
    console.log('\n🏥 Health Check:');
    console.log(`  Status: ${health.status}`);
    console.log(`  Sui CLI: ${health.suiCLI}`);
    console.log(`  Mode: ${health.mode}`);
    console.log(`  Test Passed: ${health.testPassed ? '✅' : '❌'}`);
    
    return health.status === 'ok';
  } catch (error) {
    console.error('\n❌ Health Check Error:', error.message);
    return false;
  }
}

async function testGasEstimation() {
  console.log('\n' + '='.repeat(60));
  console.log('Testing Gas Estimation');
  console.log('='.repeat(60));
  
  const code = `
module test::gas {
    public fun simple() {}
    
    public fun complex(x: u64, y: u64): u64 {
        let mut result = 0;
        let mut i = 0;
        while (i < x) {
            result = result + y;
            i = i + 1;
        };
        result
    }
}
`;
  
  try {
    const response = await fetch(`${API_URL}/api/compile/estimate-gas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();
    
    console.log('\n⛽ Gas Estimation:');
    console.log(`  Estimated Gas: ${result.estimatedGas}`);
    console.log(`  Gas Budget: ${result.gasBudget}`);
    console.log(`  Breakdown:`);
    console.log(`    Base Gas: ${result.breakdown.baseGas}`);
    console.log(`    Lines Gas: ${result.breakdown.linesGas}`);
    console.log(`    Complexity Factor: ${result.breakdown.complexityFactor}`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Gas Estimation Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('\n🚀 Starting Compilation System Tests');
  console.log(`📡 API URL: ${API_URL}\n`);
  
  // Test health first
  const healthPassed = await testHealth();
  
  if (!healthPassed) {
    console.log('\n⚠️  Warning: Health check failed, but continuing with tests...\n');
  }
  
  // Test gas estimation
  await testGasEstimation();
  
  // Run compilation tests
  const results = [];
  for (const testCase of testCases) {
    const passed = await testCompilation(testCase);
    results.push({ name: testCase.name, passed });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(r => {
    console.log(`  ${r.passed ? '✅' : '❌'} ${r.name}`);
  });
  
  console.log(`\n${passed}/${total} tests passed (${Math.round(passed/total * 100)}%)`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log(`\n⚠️  ${total - passed} test(s) failed`);
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Fatal Error:', error);
  process.exit(1);
});
