# 🚂 Railway Deployment Guide - FIXED

## ✅ Issue Fixed
The Dockerfile has been updated to properly extract the Sui CLI binary from the tar file.

**What was wrong:** The tar file structure didn't have `target/release/sui` path.

**What we fixed:** Now using `find` command to locate the `sui` binary anywhere in the extracted files and move it to `/usr/local/bin/`.

---

## 🚀 Deploy to Railway

### Step 1: Push Updated Dockerfile to Git

```bash
# Stage the fixed Dockerfile
git add backend/Dockerfile

# Commit
git commit -m "Fix: Update Dockerfile Sui CLI extraction for Railway"

# Push (after you've resolved the secret leak issue)
git push origin main
```

### Step 2: Redeploy on Railway

Railway will automatically detect the new commit and redeploy. Or you can manually trigger:

1. Go to your Railway dashboard
2. Click on your backend service
3. Click "Deploy" → "Redeploy"

### Step 3: Set Environment Variables on Railway

Make sure these are set in Railway dashboard:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_here
ANTHROPIC_API_KEY=your_anthropic_key_here
FRONTEND_URL=https://suistudio.live
```

### Step 4: Get Your Railway Backend URL

After deployment succeeds, Railway will give you a URL like:
```
https://your-app-name.up.railway.app
```

### Step 5: Update Frontend Environment Variable on Vercel

Go to Vercel dashboard and update:
```env
VITE_API_URL=https://your-app-name.up.railway.app
```

Then redeploy your frontend on Vercel.

---

## 🔍 Monitor Deployment

Watch the Railway logs to see:
1. ✅ Sui CLI installation (should now succeed)
2. ✅ npm install
3. ✅ Prisma generate
4. ✅ TypeScript build
5. ✅ Server start

---

## 🎯 Expected Build Output

You should see:
```
✅ Sui CLI installed successfully
sui 1.36.2-mainnet
```

If you still see errors, check the Railway logs and let me know!

---

## 💡 Alternative: Use Dockerfile.simple

If you don't need real Move compilation (just simulated), you can use:

```bash
# In Railway dashboard, set custom Dockerfile path:
backend/Dockerfile.simple
```

This skips Sui CLI installation entirely and deploys faster.

---

## 🆘 Troubleshooting

**Build still failing?**
- Check Railway logs for exact error
- Verify you're using the updated Dockerfile
- Try the Dockerfile.simple alternative

**Deployment succeeds but app crashes?**
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check Railway runtime logs

---

## ✨ Next Steps After Successful Deployment

1. Test backend health: `https://your-app.up.railway.app/health`
2. Update Vercel frontend with new backend URL
3. Test full stack connection
4. Your app should be live at `https://suistudio.live`! 🎉
