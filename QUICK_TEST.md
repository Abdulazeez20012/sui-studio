# 🚀 Quick Test Guide

## Run Tests Now

### Frontend Tests (Vitest)
```bash
npm test
```

### Backend Tests (Jest)
```bash
cd backend
npm test
```

### Both at Once
```bash
# Windows
run-all-tests.bat

# Linux/Mac
chmod +x run-all-tests.sh
./run-all-tests.sh
```

---

## Expected Results

### ✅ All Tests Should Pass

**Frontend (13 tests)**:
- apiService: 8 tests
- walrusService: 5 tests

**Backend (13 tests)**:
- compile API: 5 tests
- terminal API: 8 tests

---

## If Tests Fail

### Common Issues

**1. Module not found**
```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

**2. TypeScript errors**
```bash
# Check for TS errors
npm run build
```

**3. Port already in use**
```bash
# Kill process on port 3001
# Windows: netstat -ano | findstr :3001
# Linux/Mac: lsof -ti:3001 | xargs kill
```

---

## Quick Verification

Run this to verify setup:

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Verify dependencies
npm list vitest
cd backend && npm list jest
```

---

## Next Steps After Tests Pass

1. ✅ Tests pass → Ready to deploy
2. ❌ Tests fail → Check error messages
3. 🔧 Fix issues → Run tests again

---

**Ready? Run the tests now!** 🧪
