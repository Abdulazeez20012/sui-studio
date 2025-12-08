// Quick test - just check if compilation works
const http = require('http');

const testCode = `
module test::hello {
    use std::string;
    
    public fun hello_world(): string::String {
        string::utf8(b"Hello, World!")
    }
}
`;

const data = JSON.stringify({
  code: testCode,
  packageName: 'test'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/compile',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  },
  timeout: 30000
};

console.log('🧪 Testing Compilation...\n');

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(body);
      
      console.log('✅ Response received!');
      console.log(`Success: ${result.success ? '✅' : '❌'}`);
      console.log(`Mode: ${result.simulated ? 'Simulated' : 'Real Sui CLI'}`);
      
      if (result.success) {
        console.log(`Modules: ${result.modules?.length || 0}`);
        console.log(`Gas Estimate: ${result.gasEstimate || 'N/A'}`);
        console.log(`\n🎉 Compilation system is working!`);
      } else {
        console.log(`Errors: ${result.errors?.length || 0}`);
        if (result.errors) {
          result.errors.forEach(e => console.log(`  - ${e.message}`));
        }
      }
      
      process.exit(result.success ? 0 : 1);
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.log('Raw response:', body);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
  process.exit(1);
});

req.write(data);
req.end();
