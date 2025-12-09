# 🧪 Compiler Testing Guide

## Quick Test

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Run Simple Test
```bash
node test-compiler-simple.js
```

### 3. Run Full Test Suite
```bash
node test-compiler.js
```

---

## Test Cases

### ✅ Valid Code Tests
1. **Hello World Module**
   - Simple module with string function
   - Should compile successfully
   - Should generate bytecode

2. **Complex Module**
   - Struct definitions
   - Sui framework imports
   - Object creation
   - Should compile successfully

### ❌ Invalid Code Tests
1. **Missing Module Declaration**
   - Function without module
   - Should fail with module error

2. **Syntax Errors**
   - Unbalanced braces
   - Missing semicolons
   - Should fail with syntax errors

3. **Type Errors**
   - Undefined variables
   - Type mismatches
   - Should fail with type errors

---

## Manual Testing

### Test Health Endpoint
```bash
curl http://localhost:3001/api/compile/health
```

Expected response:
```json
{
  "status": "ok",
  "suiCLI": "available",
  "mode": "real",
  "testPassed": true
}
```

### Test Compilation
```bash
curl -X POST http://localhost:3001/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "module test::hello { public fun greet() {} }",
    "packageName": "test"
  }'
```

### Test Gas Estimation
```bash
curl -X POST http://localhost:3001/api/compile/estimate-gas \
  -H "Content-Type: application/json" \
  -d '{
    "code": "module test::gas { public fun test() {} }"
  }'
```

---

## Frontend Testing

### In Browser Console
```javascript
// Import compiler service
import { compilerService } from '@/services/compilerService';

// Test compilation
const code = `
module test::hello {
    public fun greet() {}
}
`;

const result = await compilerService.compile(code, 'test');
console.log('Result:', result);

// Check health
const health = await compilerService.checkHealth();
console.log('Health:', health);

// Estimate gas
const gas = await compilerService.estimateGas(code);
console.log('Gas:', gas);
```

---

## Expected Results

### With Sui CLI (Real Mode)
- ✅ Actual compilation using `sui move build`
- ✅ Real bytecode generation
- ✅ Accurate error messages with locations
- ✅ Bytecode-based gas estimation
- ⏱️ Compilation time: 1-5 seconds

### Without Sui CLI (Simulated Mode)
- ✅ Basic syntax checking
- ✅ Simulated bytecode
- ✅ Basic error detection
- ✅ Heuristic gas estimation
- ⏱️ Compilation time: < 100ms

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID <PID> /F

# Start backend
cd backend
npm run dev
```

### Sui CLI Not Found
The backend will automatically fall back to simulation mode.

To install Sui CLI:
```bash
# Already included in Docker
# Or install locally:
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

### Compilation Timeout
Increase timeout in test files:
```javascript
// In test file
const timeout = 60000; // 60 seconds
```

### Database Errors
The compiler works without database (uses in-memory cache).
To use database caching:
```bash
cd backend
# Set DATABASE_URL in .env.local
npx prisma db push
```

---

## Performance Benchmarks

### Real Compilation (with Sui CLI)
| Code Size | Time | Gas Estimate |
|-----------|------|--------------|
| Simple (10 lines) | 1-2s | 1,000-2,000 |
| Medium (50 lines) | 2-4s | 5,000-10,000 |
| Complex (200 lines) | 4-8s | 20,000-50,000 |

### Simulated Compilation
| Code Size | Time | Gas Estimate |
|-----------|------|--------------|
| Any | < 100ms | Heuristic |

### Caching
- **Cache Hit**: < 50ms
- **Cache Duration**: 24h (success), 1h (failure)
- **Cache Size**: ~1KB per entry

---

## Integration Testing

### Test with IDE
1. Open IDE in browser
2. Create new project
3. Write Move code
4. Click "Compile" button
5. Verify:
   - ✅ Compilation status shown
   - ✅ Errors displayed inline
   - ✅ Gas estimate shown
   - ✅ Bytecode available

### Test Error Display
1. Write invalid code
2. Compile
3. Verify:
   - ✅ Errors shown in editor
   - ✅ Line numbers correct
   - ✅ Suggestions displayed
   - ✅ Error messages clear

---

## Automated Testing

### Backend Tests
```bash
cd backend
npm test -- suiCompiler.test.ts
```

### Frontend Tests
```bash
npm test -- compilerService.test.ts
```

### Integration Tests
```bash
npm run test:integration
```

---

## Success Criteria

✅ **Health check passes**
✅ **Valid code compiles successfully**
✅ **Invalid code shows errors**
✅ **Error messages include locations**
✅ **Gas estimation works**
✅ **Caching functions correctly**
✅ **Simulated mode works as fallback**
✅ **No crashes or hangs**

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Test in production environment
3. ✅ Monitor compilation times
4. ✅ Collect user feedback
5. ✅ Optimize slow compilations
6. ✅ Add more test cases
7. ✅ Document edge cases

---

**Status**: Ready for Testing  
**Test Files**: 
- `test-compiler-simple.js` - Quick test
- `test-compiler.js` - Full test suite
- `backend/src/services/__tests__/suiCompiler.test.ts` - Unit tests
