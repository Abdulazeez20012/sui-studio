# 🏗️ Sui Studio Deployment Architecture

## Current Setup Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     https://suistudio.live                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ DNS Resolution
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL CDN (Frontend)                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  React App (Static Files)                                 │ │
│  │  - HTML, CSS, JavaScript                                  │ │
│  │  - Monaco Editor                                          │ │
│  │  - UI Components                                          │ │
│  │                                                            │ │
│  │  Environment Variables:                                   │ │
│  │  VITE_API_URL=https://sui-studio.onrender.com           │ │
│  │  VITE_WS_URL=wss://sui-studio.onrender.com              │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/WSS Requests
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RENDER (Backend Server)                        │
│              https://sui-studio.onrender.com                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Node.js + Express Server                                 │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  REST API Endpoints                                  │ │ │
│  │  │  - /api/compile                                      │ │ │
│  │  │  - /api/ai                                           │ │ │
│  │  │  - /api/audit                                        │ │ │
│  │  │  - /api/debugger                                     │ │ │
│  │  │  - /api/profiler                                     │ │ │
│  │  │  - /api/packages                                     │ │ │
│  │  │  - /api/git                                          │ │ │
│  │  │  - /api/test                                         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  WebSocket Server                                    │ │ │
│  │  │  - /ws (Collaboration)                               │ │ │
│  │  │  - /yjs (Real-time editing)                          │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  Environment Variables:                                   │ │
│  │  CORS_ORIGIN=https://suistudio.live                      │ │
│  │  FRONTEND_URL=https://suistudio.live                     │ │
│  │  DATABASE_URL=postgresql://...                           │ │
│  │  ANTHROPIC_API_KEY=sk-ant-...                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└──────────┬──────────────────────────┬──────────────────────────┘
           │                          │
           │                          │
           ▼                          ▼
┌──────────────────────┐   ┌──────────────────────────┐
│   NEON DATABASE      │   │   ANTHROPIC API          │
│   (PostgreSQL)       │   │   (Claude AI)            │
│                      │   │                          │
│   - User data        │   │   - Code analysis        │
│   - Projects         │   │   - Security audit       │
│   - Sessions         │   │   - AI assistance        │
└──────────────────────┘   └──────────────────────────┘
```

---

## Data Flow Diagram

### 1. User Visits Website

```
User Browser
    │
    │ 1. DNS Lookup: suistudio.live → Vercel IP
    │
    ▼
Vercel CDN
    │
    │ 2. Serve static React app
    │
    ▼
User Browser (React App Loaded)
```

### 2. User Compiles Code

```
User Browser (React)
    │
    │ 1. POST /api/compile
    │    Body: { code: "module hello {...}" }
    │
    ▼
Render Backend
    │
    │ 2. Validate request
    │ 3. Run Sui compiler
    │ 4. Return result
    │
    ▼
User Browser
    │
    │ 5. Display compilation result
    │
    ▼
User sees output
```

### 3. User Uses AI Security Audit

```
User Browser (React)
    │
    │ 1. POST /api/audit
    │    Body: { code: "module..." }
    │
    ▼
Render Backend
    │
    │ 2. Validate code
    │ 3. Call Claude AI API
    │
    ▼
Anthropic API
    │
    │ 4. Analyze code
    │ 5. Return security report
    │
    ▼
Render Backend
    │
    │ 6. Format response
    │
    ▼
User Browser
    │
    │ 7. Display security report
    │
    ▼
User sees vulnerabilities
```

### 4. Real-time Collaboration

```
User A Browser                    User B Browser
    │                                  │
    │ 1. Connect WebSocket             │ 1. Connect WebSocket
    │    wss://sui-studio.onrender.com │    wss://sui-studio.onrender.com
    │                                  │
    ▼                                  ▼
         Render WebSocket Server
                  │
                  │ 2. Sync Y.js CRDT
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
User A sees                 User B sees
User B's changes            User A's changes
```

---

## Network Configuration

### DNS Records (At Domain Registrar)

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### SSL/TLS Certificates

```
Frontend (Vercel):
- Auto-provisioned Let's Encrypt certificate
- Covers: suistudio.live, www.suistudio.live

Backend (Render):
- Auto-provisioned Let's Encrypt certificate
- Covers: sui-studio.onrender.com
```

---

## CORS Configuration

### Backend CORS Settings

```javascript
// Allowed Origins
const allowedOrigins = [
  'https://suistudio.live',
  'https://www.suistudio.live',
  'http://localhost:3000',      // Development
  'http://localhost:5173',      // Vite dev server
  '*.vercel.app',               // Preview deployments
];

// CORS Headers
Access-Control-Allow-Origin: https://suistudio.live
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Environment Variables Map

### Frontend (Vercel)

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | `https://sui-studio.onrender.com` | Backend API endpoint |
| `VITE_WS_URL` | `wss://sui-studio.onrender.com` | WebSocket endpoint |
| `VITE_SUI_NETWORK` | `testnet` | Sui blockchain network |
| `VITE_ENABLE_AI` | `true` | Enable AI features |
| `VITE_ENABLE_COLLABORATION` | `true` | Enable real-time collab |

### Backend (Render)

| Variable | Value | Purpose |
|----------|-------|---------|
| `CORS_ORIGIN` | `https://suistudio.live` | Allowed frontend origin |
| `FRONTEND_URL` | `https://suistudio.live` | Frontend URL |
| `DATABASE_URL` | `postgresql://...` | Neon database connection |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Claude AI API key |
| `NODE_ENV` | `production` | Environment mode |

---

## Request Flow Examples

### Example 1: Compile Move Code

```
1. User clicks "Compile" button
   ↓
2. Frontend sends request:
   POST https://sui-studio.onrender.com/api/compile
   Headers: {
     Content-Type: application/json
     Origin: https://suistudio.live
   }
   Body: {
     code: "module hello_world { ... }",
     projectId: "abc123"
   }
   ↓
3. Backend receives request:
   - Checks CORS (suistudio.live is allowed ✓)
   - Validates request body
   - Runs Sui compiler
   ↓
4. Backend responds:
   Status: 200 OK
   Headers: {
     Access-Control-Allow-Origin: https://suistudio.live
   }
   Body: {
     success: true,
     output: "Compiled successfully",
     bytecode: "0x..."
   }
   ↓
5. Frontend receives response:
   - Displays success message
   - Shows compiled bytecode
```

### Example 2: AI Security Audit

```
1. User clicks "Run Security Audit"
   ↓
2. Frontend sends request:
   POST https://sui-studio.onrender.com/api/audit
   Body: { code: "..." }
   ↓
3. Backend processes:
   - Validates code
   - Calls Claude AI API
   - Analyzes for vulnerabilities
   ↓
4. Claude AI responds:
   - Security analysis
   - Vulnerability list
   - Risk score
   ↓
5. Backend formats response:
   {
     vulnerabilities: [...],
     riskScore: 75,
     recommendations: [...]
   }
   ↓
6. Frontend displays:
   - Security report UI
   - Vulnerability highlights
   - Fix suggestions
```

---

## Monitoring & Debugging

### Health Check Endpoints

```bash
# Frontend Health
curl https://suistudio.live
# Should return: HTML page

# Backend Health
curl https://sui-studio.onrender.com/health
# Should return: {"status":"ok","timestamp":"..."}

# WebSocket Health
wscat -c wss://sui-studio.onrender.com/ws
# Should connect successfully
```

### Log Locations

```
Frontend Logs:
- Vercel Dashboard → Deployments → View Function Logs
- Browser Console (F12)

Backend Logs:
- Render Dashboard → Service → Logs tab
- Real-time streaming available

Database Logs:
- Neon Dashboard → Operations → Logs
```

---

## Performance Optimization

### CDN Caching (Vercel)

```
Static Assets:
- HTML: No cache (always fresh)
- JS/CSS: Cached with hash (immutable)
- Images: Cached for 1 year

API Responses:
- No caching (dynamic data)
```

### Backend Optimization (Render)

```
- Connection pooling for database
- Rate limiting (100 req/15min per IP)
- Gzip compression enabled
- Keep-alive connections
```

---

## Security Layers

```
┌─────────────────────────────────────┐
│  1. DNS/CDN Layer (Vercel)          │
│     - DDoS protection               │
│     - SSL/TLS encryption            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  2. Application Layer (Backend)     │
│     - CORS validation               │
│     - Rate limiting                 │
│     - Input validation              │
│     - JWT authentication            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  3. Database Layer (Neon)           │
│     - SSL connections               │
│     - Connection pooling            │
│     - Query parameterization        │
└─────────────────────────────────────┘
```

---

## Troubleshooting Guide

### Issue: CORS Error

```
Error: Access to fetch at 'https://sui-studio.onrender.com/api/...' 
from origin 'https://suistudio.live' has been blocked by CORS policy

Solution:
1. Check CORS_ORIGIN in Render includes suistudio.live
2. Verify backend is running
3. Check browser console for exact error
4. Test in incognito mode
```

### Issue: WebSocket Connection Failed

```
Error: WebSocket connection to 'wss://sui-studio.onrender.com/ws' failed

Solution:
1. Verify VITE_WS_URL uses wss:// (not ws://)
2. Check if backend WebSocket server is running
3. Test with: wscat -c wss://sui-studio.onrender.com/ws
4. Check Render logs for WebSocket errors
```

### Issue: 502 Bad Gateway

```
Error: 502 Bad Gateway from Render

Solution:
1. Backend is starting up (wait 30 seconds)
2. Backend crashed (check Render logs)
3. Database connection failed (check DATABASE_URL)
4. Out of memory (upgrade Render plan)
```

---

**Last Updated:** December 9, 2024  
**Architecture Version:** 1.0
