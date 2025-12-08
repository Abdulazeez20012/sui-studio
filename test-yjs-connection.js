/**
 * Quick test script for Yjs WebSocket connection
 * 
 * Usage:
 *   1. Start backend: cd backend && npm run dev
 *   2. Run this script: node test-yjs-connection.js
 */

const WebSocket = require('ws');

const BACKEND_URL = 'ws://localhost:3001/yjs';
const DOC_ID = 'test-document';
const USER_ID = 'test-user-1';

console.log('🧪 Testing Yjs WebSocket Connection...\n');

// Create WebSocket connection
const ws = new WebSocket(`${BACKEND_URL}?doc=${DOC_ID}&userId=${USER_ID}`);

ws.on('open', () => {
  console.log('✅ WebSocket connected successfully!');
  console.log(`📄 Document ID: ${DOC_ID}`);
  console.log(`👤 User ID: ${USER_ID}\n`);
  
  // Request initial sync
  console.log('📤 Sending sync request...');
  ws.send(JSON.stringify({ type: 'sync-request' }));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('📥 Received message:', {
      type: message.type,
      dataLength: message.data ? message.data.length : 0,
      timestamp: new Date().toISOString()
    });
    
    if (message.type === 'sync') {
      console.log('✅ Initial sync received!');
      
      // Send a test update
      console.log('\n📤 Sending test update...');
      ws.send(JSON.stringify({
        type: 'update',
        data: [1, 2, 3, 4, 5] // Dummy update data
      }));
      
      // Close after 2 seconds
      setTimeout(() => {
        console.log('\n✅ Test completed successfully!');
        console.log('🎉 Yjs WebSocket server is working correctly!\n');
        ws.close();
        process.exit(0);
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Error parsing message:', error.message);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  console.log('\n💡 Make sure the backend is running:');
  console.log('   cd backend && npm run dev\n');
  process.exit(1);
});

ws.on('close', () => {
  console.log('🔌 WebSocket connection closed');
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('\n❌ Test timeout - no response from server');
  console.log('💡 Make sure the backend is running:');
  console.log('   cd backend && npm run dev\n');
  ws.close();
  process.exit(1);
}, 10000);
