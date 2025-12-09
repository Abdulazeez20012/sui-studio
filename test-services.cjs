// Quick test to verify backend and frontend are running
const http = require('http');

console.log('🧪 Testing Sui Studio Services...\n');

// Test Backend
const testBackend = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend: Running on http://localhost:3001');
          console.log('   Status:', res.statusCode);
          resolve(true);
        } else {
          console.log('⚠️  Backend: Responded but with status', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Backend: Not responding');
      console.log('   Error:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('⏱️  Backend: Request timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Test Frontend
const testFrontend = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend: Running on http://localhost:3000');
        console.log('   Status:', res.statusCode);
        resolve(true);
      } else {
        console.log('⚠️  Frontend: Responded but with status', res.statusCode);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log('❌ Frontend: Not responding');
      console.log('   Error:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('⏱️  Frontend: Request timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Run tests
(async () => {
  const backendOk = await testBackend();
  console.log('');
  const frontendOk = await testFrontend();
  
  console.log('\n' + '='.repeat(50));
  if (backendOk && frontendOk) {
    console.log('🎉 All services are running successfully!');
    console.log('\n📱 Access your application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:3001');
    console.log('   Network:  http://172.16.0.240:3000');
  } else {
    console.log('⚠️  Some services are not responding properly');
    console.log('   Please check the logs above for details');
  }
  console.log('='.repeat(50));
})();
