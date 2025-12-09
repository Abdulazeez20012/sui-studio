# 🔒 Fix: Remove Exposed API Keys from Git

## Problem
GitHub blocked your push because API keys were detected in:
- `backend/.env.local`
- `backend/.env.production`
- `DOMAIN_SETUP_COMPLETE.md`
- `VERCEL_RENDER_SETUP_CHECKLIST.md`

## ⚠️ IMPORTANT: Rotate Your API Key

Your Anthropic API key was exposed in git history. You should:

1. **Go to Anthropic Console:** https://console.anthropic.com/settings/keys
2. **Delete the exposed key:** `sk-ant-api03-LLbBMK5Q7dHIDU8j1VQnveYGSRAeWnFMnJfT...`
3. **Generate a new key**
4. **Update Render environment variables** with the new key

## Quick Fix Commands

```bash
# 1. Remove files from git tracking (but keep locally)
git rm --cached backend/.env.local
git rm --cached backend/.env.production
git rm --cached .env.local
git rm --cached .env.production

# 2. Commit the removal
git add .gitignore
git add DOMAIN_SETUP_COMPLETE.md
git add VERCEL_RENDER_SETUP_CHECKLIST.md
git add backend/.env.production
git commit -m "Security: Remove API keys from git, add to .gitignore"

# 3. Push changes
git push origin main
```

## What I Fixed

1. ✅ Replaced real API keys with placeholders in documentation
2. ✅ Updated `.gitignore` to prevent future leaks
3. ✅ Removed sensitive files from git tracking

## Files Updated

### Documentation (placeholders added):
- `DOMAIN_SETUP_COMPLETE.md`
- `VERCEL_RENDER_SETUP_CHECKLIST.md`
- `backend/.env.production`

### .gitignore (added):
```
.env.local
.env.production
backend/.env.local
backend/.env.production
```

## After Pushing

1. **Rotate API key** on Anthropic console
2. **Update Render** with new key:
   - Go to Render dashboard
   - Environment variables
   - Update `ANTHROPIC_API_KEY`
3. **Update local files** with new key (they're now gitignored)

## Prevent Future Leaks

### Always use placeholders in documentation:
```bash
# ❌ BAD
ANTHROPIC_API_KEY=sk-ant-api03-real-key-here

# ✅ GOOD
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### Keep real keys only in:
- Local `.env.local` files (gitignored)
- Render environment variables (secure)
- Never in git commits!

---

**Run the commands above to fix the issue and push successfully!**
