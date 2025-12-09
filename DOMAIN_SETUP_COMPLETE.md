# 🌐 Domain Setup Guide: suistudio.live

## Current Issue
Your frontend is deployed to Vercel at `suistudio.live` but it's not connecting to your Render backend because the environment variables aren't properly configured.

---

## ✅ Step-by-Step Setup

### 1. **Vercel Environment Variables Setup**

Go to your Vercel project dashboard and add these environment variables:

#### Required Variables:

```bash
# Backend API URL (Your Render Backend)
VITE_API_URL=https://sui-studio.onrender.com

# WebSocket URL (Same as backend)
VITE_WS_URL=wss://sui-studio.onrender.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com

# Sui Network Configuration
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Sui Subscription Contract
VITE_SUBSCRIPTION_PACKAGE_ID=0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4
VITE_SUBSCRIPTION_TREASURY_ID=0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24
VITE_SUBSCRIPTION_PRICING_ID=0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274
VITE_SUBSCRIPTION_CLOCK_ID=0x6

# Feature Flags
VITE_ENABLE_COLLABORATION=true
VITE_ENABLE_AI=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_VIDEO_CHAT=true
VITE_ENABLE_WALRUS=true
VITE_ENABLE_SUBSCRIPTIONS=true
VITE_ENABLE_EXTENSIONS=true

# Walrus Storage
VITE_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
VITE_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
VITE_WALRUS_NETWORK=testnet

# App Version
VITE_APP_VERSION=1.0.0
```

**How to add in Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your `sui-studio` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Select **Production**, **Preview**, and **Development** for each
6. Click **Save**

---

### 2. **Render Backend Environment Variables**

Go to your Render dashboard and verify these variables are set:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_MdO9AVl3QyUN@ep-fragrant-mode-ahofuda5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# AI Provider
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096

# CORS Configuration (CRITICAL!)
CORS_ORIGIN=https://suistudio.live,https://www.suistudio.live

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=production

# Port (Render sets this automatically)
PORT=3001
```

**How to add in Render:**
1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Add/update the variables above
5. Click **Save Changes**
6. Render will automatically redeploy

---

### 3. **Update Backend CORS Configuration**

Your backend needs to allow requests from your domain. Let me update the backend configuration:

