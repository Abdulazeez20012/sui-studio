# 🚀 Deploy Backend with Sui CLI to Render

## Quick Deploy Guide

---

## ✅ Prerequisites

- [x] Sui CLI added to Dockerfile ✅
- [x] render.yaml configured ✅
- [x] Backend code ready ✅
- [ ] Render account
- [ ] GitHub repo connected

---

## 🚀 Deployment Steps

### 1. Commit Changes

```bash
git add backend/Dockerfile
git add backend/install-sui-cli.sh
git add backend/install-sui-cli.bat
git add backend/verify-sui-cli.js
git add SUI_CLI_INSTALLATION_COMPLETE.md
git add DEPLOY_WITH_SUI_CLI.md

git commit -m "Add Sui CLI to backend for real compilation"
git push origin main
```

### 2. Deploy to Render

**Option A: Automatic (if connected)**
- Render will automatically detect changes
- Build will start automatically
- Wait 15-20 minutes for first build

**Option B: Manual**
1. Go to https://dashboard.render.com/
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for build to complete

### 3. Monitor Build

Watch the build logs for:
```
✅ Installing Rust
✅ Installing Sui CLI
✅ Sui CLI installed successfully
✅ Building backend
✅ Deploy successful
```

---

## ⏱️ Build Times

| Build Type | Time | Reason |
|------------|------|--------|
| **First Build** | 15-20 min | Compiling Sui CLI from source |
| **Subsequent** | 5-10 min | Docker layer caching |
| **Code Changes** | 2-5 min | Only rebuilds changed layers |

---

## 🧪 Verify Deployment

### Check Health Endpoint

```bash
curl https://your-backend.onrender.com/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2024-12-08T..."
}
```

### Test Compilation

```bash
curl -X POST https://your-backend.onrender.com/api/compile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "module hello::world { public fun hello() {} }",
    "fileName": "hello.move"
  }'
```

Expected:
```json
{
  "success": true,
  "bytecode": "...",
  "gasEstimate": 1000
}
```

---

## 🔧 Environment Variables

Ensure these are set in Render:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
FRONTEND_URL=https://your-frontend.vercel.app
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

---

## 📊 What Changes

### Before Deployment
- ❌ Simulated compilation
- ❌ Mock error messages
- ❌ Estimated gas costs

### After Deployment
- ✅ Real Sui compiler
- ✅ Accurate error messages
- ✅ Real gas calculations
- ✅ Production bytecode

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "cargo: command not found"
**Fix**: Rust installation failed, check Dockerfile

**Error**: "Sui CLI compilation timeout"
**Fix**: Increase build timeout in Render settings

### Sui CLI Not Working

**Check logs**:
```bash
# In Render dashboard, check logs for:
sui --version
```

**Should see**:
```
sui 1.x.x
```

### Compilation Still Simulated

**Check backend logs**:
```bash
# Should see:
✅ Sui CLI detected
✅ Using real compilation
```

**If not**:
```bash
# Verify Sui CLI in container:
sui --version
which sui
```

---

## 📈 Performance Impact

### Compilation Speed
- **Simulated**: Instant (fake)
- **Real**: 2-5 seconds (actual compilation)

### Memory Usage
- **Before**: ~200MB
- **After**: ~300MB (Sui CLI loaded)

### Disk Space
- **Before**: ~500MB
- **After**: ~1.5GB (Sui CLI + Rust)

---

## ✅ Success Checklist

- [ ] Dockerfile includes Sui CLI installation
- [ ] Changes committed to git
- [ ] Pushed to GitHub
- [ ] Render build started
- [ ] Build completed successfully
- [ ] Health check passes
- [ ] Compilation endpoint works
- [ ] Real bytecode generated
- [ ] Error messages accurate

---

## 🎉 You're Done!

Your backend now has:
- ✅ Real Sui CLI compilation
- ✅ Accurate error messages
- ✅ Real gas estimation
- ✅ Production-ready bytecode
- ✅ Full Move language support

---

**Next**: Test compilation in your IDE!

