# 🔧 Render Environment Variables Setup

**Date**: December 6, 2025  
**Backend**: https://sui-studio.onrender.com

---

## 📋 Required Environment Variables

Add these in your Render dashboard under **Environment** section:

### 1. Database Connection
```env
DATABASE_URL=your-neon-database-connection-string-here
```
**Get from**: Neon Dashboard → Connection Details

### 2. JWT Secret
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Node Environment
```env
NODE_ENV=production
```

### 4. Port (Optional - Render sets this automatically)
```env
PORT=3001
```

### 5. CORS Origin (Your Frontend URL)
```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

### 6. OpenAI API Key (Optional - for AI features)
```env
OPENAI_API_KEY=your-openai-api-key-here
```
**Get from**: OpenAI Dashboard → API Keys

---

## 🚀 How to Add in Render

### Step 1: Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Select your `sui-studio-backend` service
3. Click on **Environment** in the left sidebar

### Step 2: Add Environment Variables
Click **Add Environment Variable** for each:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Your Neon connection string from dashboard

#### JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Generate a secure random string (or use: `openssl rand -base64 32`)

#### NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

#### CORS_ORIGIN
- **Key**: `CORS_ORIGIN`
- **Value**: Your Vercel frontend URL (e.g., `https://sui-studio.vercel.app`)

### Step 3: Save and Redeploy
1. Click **Save Changes**
2. Render will automatically redeploy your service
3. Wait ~3-5 minutes for deployment

---

## ✅ Verify Database Connection

After deployment, test the connection:

### 1. Check Health Endpoint
```bash
curl https://sui-studio.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T18:30:00.000Z"
}
```

### 2. Check Logs in Render
Look for:
```
✓ Database connected successfully
🚀 Sui Studio Backend running on port 3001
```

### 3. Test Database Query
If you have a test endpoint, try:
```bash
curl https://sui-studio.onrender.com/api/projects
```

---

## 🔒 Security Best Practices

### Generate Secure JWT Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Database Connection Security
- ✅ Using connection pooler (`-pooler` in URL)
- ✅ SSL mode required
- ✅ Channel binding enabled
- ✅ Credentials secured in Render environment

---

## 🎯 Complete Environment Variables List

Copy this template and fill in your values:

```env
# Database
DATABASE_URL=your-neon-connection-string

# Authentication
JWT_SECRET=your-generated-secret-here

# Environment
NODE_ENV=production
PORT=3001

# CORS
CORS_ORIGIN=https://your-frontend.vercel.app

# Optional: AI Features
OPENAI_API_KEY=your-openai-key-here

# Optional: Sui Network (defaults to testnet)
SUI_NETWORK=testnet
```

---

## 🔄 After Adding Environment Variables

### Automatic Redeploy
Render will automatically:
1. Detect environment variable changes
2. Trigger a new deployment
3. Restart the service with new variables
4. Run database migrations (if configured)

### Manual Redeploy (if needed)
1. Go to your service in Render
2. Click **Manual Deploy** → **Deploy latest commit**

---

## 🧪 Test Database Connection Locally

To test the connection string locally:

```bash
cd backend

# Add to backend/.env.local
echo 'DATABASE_URL="your-neon-connection-string"' > .env.local

# Test connection
npm run dev
```

---

## 📊 Expected Deployment Timeline

1. **Add Environment Variables**: 2 minutes
2. **Automatic Redeploy**: 3-5 minutes
3. **Service Restart**: 30 seconds
4. **Total Time**: ~5-7 minutes

---

## ⚠️ Troubleshooting

### Issue: Database Connection Failed
**Check**:
- DATABASE_URL is correctly formatted
- No extra spaces in the connection string
- Neon database is active (check Neon dashboard)

### Issue: JWT Errors
**Check**:
- JWT_SECRET is set
- JWT_SECRET is at least 32 characters
- No special characters causing issues

### Issue: CORS Errors
**Check**:
- CORS_ORIGIN matches your frontend URL exactly
- Include protocol (https://)
- No trailing slash

---

## ✅ Verification Checklist

- [ ] DATABASE_URL added in Render
- [ ] JWT_SECRET generated and added
- [ ] NODE_ENV set to production
- [ ] CORS_ORIGIN set to frontend URL
- [ ] Environment variables saved
- [ ] Automatic redeploy triggered
- [ ] Deployment completed successfully
- [ ] Health check passing
- [ ] Database connection working
- [ ] Backend logs show no errors

---

## 🎉 Next Steps

After environment variables are set:

1. **Wait for Redeploy** (~5 minutes)
2. **Test Backend** (health check, API endpoints)
3. **Update Frontend** (set backend URL in Vercel)
4. **Deploy Frontend** (push changes)
5. **Test Full Stack** (end-to-end testing)

---

**Status**: Ready to Configure  
**Time Required**: 5-7 minutes  
**Difficulty**: Easy  

🚀 **Let's get your database connected!**
