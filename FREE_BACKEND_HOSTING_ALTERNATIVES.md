# 🚀 Free Backend Hosting Alternatives to Render

## Comparison Table

| Platform | Free Tier | Sleep Policy | Database | WebSocket | Best For |
|----------|-----------|--------------|----------|-----------|----------|
| **Railway** | $5 credit/month | No sleep | ✅ PostgreSQL | ✅ Yes | Best overall |
| **Fly.io** | 3 VMs free | No sleep | ✅ PostgreSQL | ✅ Yes | Global edge |
| **Koyeb** | 1 service free | No sleep | ❌ External | ✅ Yes | Simple deploy |
| **Cyclic** | Unlimited | No sleep | ✅ DynamoDB | ⚠️ Limited | Serverless |
| **Adaptable** | 1 app free | No sleep | ✅ PostgreSQL | ✅ Yes | Easy setup |
| **Glitch** | Unlimited | 5min sleep | ❌ External | ⚠️ Limited | Quick prototypes |
| **Heroku** | Discontinued | - | - | - | ❌ No longer free |

---

## 1. 🚂 Railway (RECOMMENDED)

**Best alternative to Render with similar features**

### Pros
- ✅ $5 free credit per month (~500 hours)
- ✅ No sleep/cold starts
- ✅ Built-in PostgreSQL
- ✅ WebSocket support
- ✅ GitHub auto-deploy
- ✅ Custom domains
- ✅ Environment variables UI
- ✅ Real-time logs

### Cons
- ⚠️ Limited to $5/month credit
- ⚠️ Requires credit card after trial

### Setup Time: 5 minutes

### Quick Setup

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd backend
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Deploy
railway up

# 6. Set environment variables
railway variables set CORS_ORIGIN=https://suistudio.live
railway variables set FRONTEND_URL=https://suistudio.live
railway variables set ANTHROPIC_API_KEY=your-key

# 7. Get URL
railway domain
```

### Configuration

Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Dashboard:** https://railway.app

---

## 2. 🪰 Fly.io

**Global edge deployment with excellent performance**

### Pros
- ✅ 3 VMs free (256MB RAM each)
- ✅ No sleep/cold starts
- ✅ Global edge locations
- ✅ Built-in PostgreSQL (3GB free)
- ✅ WebSocket support
- ✅ Custom domains
- ✅ Excellent documentation

### Cons
- ⚠️ CLI-focused (less GUI)
- ⚠️ Requires credit card
- ⚠️ Complex for beginners

### Setup Time: 10 minutes

### Quick Setup

```bash
# 1. Install Fly CLI
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# 2. Login
fly auth login

# 3. Launch app
cd backend
fly launch

# 4. Create PostgreSQL
fly postgres create

# 5. Attach database
fly postgres attach <postgres-app-name>

# 6. Set secrets
fly secrets set CORS_ORIGIN=https://suistudio.live
fly secrets set FRONTEND_URL=https://suistudio.live
fly secrets set ANTHROPIC_API_KEY=your-key

# 7. Deploy
fly deploy
```

### Configuration

Create `fly.toml`:
```toml
app = "sui-studio-backend"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

**Dashboard:** https://fly.io/dashboard

---

## 3. 🚀 Koyeb

**Simplest deployment, similar to Render**

### Pros
- ✅ 1 free service (no credit card needed)
- ✅ No sleep/cold starts
- ✅ GitHub auto-deploy
- ✅ WebSocket support
- ✅ Custom domains
- ✅ Easy UI
- ✅ Global CDN

### Cons
- ⚠️ No built-in database (use Neon)
- ⚠️ Limited to 1 service
- ⚠️ 512MB RAM limit

### Setup Time: 5 minutes

### Quick Setup

1. Go to https://app.koyeb.com
2. Click **Create App**
3. Select **GitHub** repository
4. Choose `backend` folder
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`
7. Add environment variables:
   ```
   DATABASE_URL=your-neon-url
   CORS_ORIGIN=https://suistudio.live
   FRONTEND_URL=https://suistudio.live
   ANTHROPIC_API_KEY=your-key
   NODE_ENV=production
   ```
8. Click **Deploy**

**Dashboard:** https://app.koyeb.com

---

## 4. 🔄 Cyclic

**Serverless Node.js hosting**

### Pros
- ✅ Unlimited apps free
- ✅ No sleep/cold starts
- ✅ GitHub auto-deploy
- ✅ Built-in DynamoDB
- ✅ Custom domains
- ✅ No credit card needed

### Cons
- ⚠️ Serverless (cold starts on first request)
- ⚠️ Limited WebSocket support
- ⚠️ DynamoDB only (no PostgreSQL)
- ⚠️ 1GB bandwidth/month

### Setup Time: 3 minutes

### Quick Setup

1. Go to https://app.cyclic.sh
2. Click **Link Your Own**
3. Select GitHub repository
4. Choose `backend` folder
5. Add environment variables
6. Click **Deploy**

**Note:** You'll need to use Neon for PostgreSQL instead of built-in database.

**Dashboard:** https://app.cyclic.sh

---

## 5. 🔧 Adaptable

**Easy deployment with PostgreSQL**

### Pros
- ✅ 1 free app
- ✅ No sleep/cold starts
- ✅ Built-in PostgreSQL
- ✅ GitHub auto-deploy
- ✅ WebSocket support
- ✅ Easy UI

### Cons
- ⚠️ Limited resources
- ⚠️ Smaller community
- ⚠️ Less documentation

### Setup Time: 5 minutes

### Quick Setup

1. Go to https://adaptable.io
2. Click **Deploy Your App**
3. Connect GitHub
4. Select repository
5. Choose **Node.js** template
6. Add PostgreSQL addon
7. Set environment variables
8. Click **Deploy**

**Dashboard:** https://app.adaptable.io

---

## 6. 🎨 Glitch (Not Recommended for Production)

**Quick prototyping only**

### Pros
- ✅ Unlimited projects
- ✅ No credit card needed
- ✅ Live code editor
- ✅ Instant deploy

### Cons
- ❌ Sleeps after 5 minutes inactivity
- ❌ Limited resources
- ❌ Not suitable for production
- ❌ Limited WebSocket support

**Only use for testing/demos, not production!**

---

## 📊 Detailed Comparison

### Performance

| Platform | Cold Start | Response Time | Uptime |
|----------|------------|---------------|--------|
| Railway | None | ~50ms | 99.9% |
| Fly.io | None | ~30ms | 99.95% |
| Koyeb | None | ~60ms | 99.9% |
| Cyclic | ~500ms | ~100ms | 99.5% |
| Adaptable | None | ~80ms | 99.8% |

### Resource Limits (Free Tier)

| Platform | RAM | CPU | Storage | Bandwidth |
|----------|-----|-----|---------|-----------|
| Railway | 512MB | Shared | 1GB | Unlimited |
| Fly.io | 256MB | Shared | 3GB | 160GB/mo |
| Koyeb | 512MB | Shared | 2GB | Unlimited |
| Cyclic | 1GB | Shared | 1GB | 1GB/mo |
| Adaptable | 256MB | Shared | 1GB | 100GB/mo |

---

## 🎯 Recommendations

### For Your Sui Studio Project

**Best Choice: Railway**
- Similar to Render
- No sleep policy
- Built-in PostgreSQL
- WebSocket support
- $5/month free credit is enough

**Alternative: Fly.io**
- Better performance
- Global edge deployment
- More complex setup
- Great for scaling later

**Budget Option: Koyeb**
- Completely free (no credit card)
- Simple setup
- Use Neon for database
- Good for MVP

---

## 🚀 Migration Guide: Render → Railway

### Step 1: Export from Render

```bash
# Export environment variables from Render dashboard
# Copy all variables to a file
```

### Step 2: Setup Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize in backend folder
cd backend
railway init

# Add PostgreSQL
railway add postgresql

# Import environment variables
railway variables set CORS_ORIGIN=https://suistudio.live
railway variables set FRONTEND_URL=https://suistudio.live
railway variables set ANTHROPIC_API_KEY=your-key
railway variables set AI_PROVIDER=claude
railway variables set ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
railway variables set NODE_ENV=production

# Deploy
railway up

# Get your new URL
railway domain
```

### Step 3: Update Frontend

Update `.env.production`:
```bash
VITE_API_URL=https://your-app.railway.app
VITE_WS_URL=wss://your-app.railway.app
```

### Step 4: Redeploy Frontend

```bash
# Push to trigger Vercel redeploy
git add .env.production
git commit -m "Update API URL to Railway"
git push
```

---

## 💰 Cost Comparison (After Free Tier)

| Platform | Starter Plan | Pro Plan |
|----------|--------------|----------|
| Railway | $5/mo (pay as you go) | $20/mo |
| Fly.io | $0 (pay per resource) | ~$10/mo |
| Koyeb | $5.50/mo | $29/mo |
| Render | $7/mo | $25/mo |
| Cyclic | $1/mo | $10/mo |

---

## 🔧 Setup Scripts

### Railway Setup Script

Create `deploy-railway.sh`:
```bash
#!/bin/bash

echo "🚂 Deploying to Railway..."

# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add PostgreSQL
railway add postgresql

# Set environment variables
railway variables set CORS_ORIGIN=https://suistudio.live
railway variables set FRONTEND_URL=https://suistudio.live
railway variables set NODE_ENV=production

# Deploy
railway up

echo "✅ Deployed! Get your URL with: railway domain"
```

### Fly.io Setup Script

Create `deploy-fly.sh`:
```bash
#!/bin/bash

echo "🪰 Deploying to Fly.io..."

# Install Fly CLI (Windows)
iwr https://fly.io/install.ps1 -useb | iex

# Login
fly auth login

# Launch
fly launch --name sui-studio-backend

# Create PostgreSQL
fly postgres create --name sui-studio-db

# Attach database
fly postgres attach sui-studio-db

# Set secrets
fly secrets set CORS_ORIGIN=https://suistudio.live
fly secrets set FRONTEND_URL=https://suistudio.live
fly secrets set NODE_ENV=production

# Deploy
fly deploy

echo "✅ Deployed! Your app is live at: https://sui-studio-backend.fly.dev"
```

---

## 📝 Summary

### Quick Decision Matrix

**Choose Railway if:**
- ✅ You want the easiest migration from Render
- ✅ You need built-in PostgreSQL
- ✅ You're okay with $5/month limit

**Choose Fly.io if:**
- ✅ You want best performance
- ✅ You need global deployment
- ✅ You're comfortable with CLI

**Choose Koyeb if:**
- ✅ You want completely free (no credit card)
- ✅ You're okay using external database (Neon)
- ✅ You want simple UI

**Avoid:**
- ❌ Glitch (sleeps after 5 minutes)
- ❌ Heroku (no longer free)
- ❌ Cyclic (limited WebSocket support)

---

## 🎯 My Recommendation for Sui Studio

**Use Railway** because:
1. Most similar to Render (easy migration)
2. No sleep policy (always on)
3. Built-in PostgreSQL (no external setup)
4. WebSocket support (for collaboration)
5. $5/month free credit is enough for your traffic
6. Easy to scale when you get users

**Setup time:** 10 minutes  
**Migration difficulty:** Easy  
**Cost:** Free for first few months

---

**Need help setting up? Check the migration guide above!**
