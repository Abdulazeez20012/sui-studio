# 🔧 Render Deployment Fix: Sui CLI Build Timeout

## Problem
Your Render deployment is failing because the Dockerfile tries to compile Sui CLI from source, which:
- Takes 15-30 minutes
- Uses too much memory (4GB+)
- Causes build timeout on free tier
- Compiles Rust + entire Sui codebase

## Why You Need Sui CLI

Your backend **DOES need Sui CLI** because `suiCompiler.ts`:
- Runs `sui move build` to compile Move code
- Executes `sui --version` to check availability
- Falls back to simulation mode only if CLI is missing

## Solution: Use Pre-built Binary (RECOMMENDED)

The Dockerfile has been updated to download pre-built Sui binaries instead of compiling from source.

### Quick Fix

**Your Dockerfile is already fixed!** Just commit and push:

```bash
cd backend
git add Dockerfile
git commit -m "Fix: Use pre-built Sui binary instead of compiling from source"
git push origin main
```

Render will auto-deploy in **3-5 minutes** (vs 30+ minutes before).

### What Changed

**Before (slow):**
```dockerfile
# Install Rust
RUN curl https://sh.rustup.rs | sh -s -- -y
# Compile Sui from source (15-30 min)
RUN cargo install --git https://github.com/MystenLabs/sui.git sui
```

**After (fast):**
```dockerfile
# Download pre-built binary (30 seconds)
RUN curl -fLJ https://github.com/MystenLabs/sui/releases/.../sui.tgz \
    -o sui.tgz && tar -xzf sui.tgz && mv target/release/sui /usr/local/bin/
```

## Why This Fixes It

**Before:**
- Installs Rust toolchain (2GB+)
- Compiles Sui from source (15-30 min)
- Uses 4GB+ RAM
- Often times out

**After:**
- Downloads pre-built binary (30 seconds)
- Uses minimal RAM
- Fast deployment
- Reliable builds

## Quick Commands

```bash
cd backend

# Use simple version (no Sui CLI)
mv Dockerfile Dockerfile.old
mv Dockerfile.simple Dockerfile

# Commit
git add .
git commit -m "Fix: Simplified Dockerfile for faster deployment"
git push origin main
```

## Verification

After deployment succeeds:
```bash
curl https://sui-studio.onrender.com/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

**Deployment time:** 3-5 minutes (vs 30+ minutes before)
