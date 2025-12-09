# 🔧 Fix Git History - Remove API Keys from Old Commits

## Problem
GitHub is blocking because the API key exists in **old commits** (b412f3ba and 3244e034), not just the current one.

## Solution: Use GitHub's Allow Secret Feature

Since rewriting git history is complex and risky, use GitHub's built-in feature to allow this specific secret:

### Quick Fix (Recommended)

1. **Click the GitHub link** from the error message:
   ```
   https://github.com/Abdulazeez20012/sui-studio/security/secret-scanning/unblock-secret/36bKVEtPhqflCz47VGojpDkPzpm
   ```

2. **Click "Allow secret"** on that page

3. **Push again:**
   ```bash
   git push origin main
   ```

4. **IMMEDIATELY rotate the API key** after push succeeds:
   - Go to https://console.anthropic.com/settings/keys
   - Delete the old key
   - Generate new key
   - Update Render with new key

---

## Alternative: Rewrite Git History (Advanced)

If you want to completely remove the secret from history:

### ⚠️ WARNING: This rewrites history and requires force push!

```bash
# 1. Install git-filter-repo (if not installed)
pip install git-filter-repo

# 2. Create a file with the secret to remove
echo "your-actual-api-key-here" > secret.txt

# 3. Remove secret from all history
git filter-repo --replace-text secret.txt --force

# 4. Force push (DANGEROUS - only if you're the only developer)
git push origin main --force

# 5. Clean up
rm secret.txt
```

### Risks of Force Push:
- ❌ Breaks other developers' local repos
- ❌ Loses all forks
- ❌ Can't undo easily
- ❌ Requires everyone to re-clone

---

## Recommended Approach

**Use GitHub's "Allow Secret" feature:**

1. ✅ Click the GitHub link to allow the secret
2. ✅ Push successfully
3. ✅ Immediately rotate the API key
4. ✅ New key is never in git history

**Why this is better:**
- No force push needed
- No risk of breaking things
- Quick and simple
- Key gets rotated anyway

---

## After Successful Push

### 1. Rotate API Key (CRITICAL)
```bash
# Go to Anthropic Console
https://console.anthropic.com/settings/keys

# Delete old key:
sk-ant-api03-xxxxx... (your old exposed key)

# Generate new key
# Copy the new key
```

### 2. Update Render
```bash
# Go to Render Dashboard
https://dashboard.render.com

# Your service → Environment
# Update: ANTHROPIC_API_KEY=<new-key>
# Save (auto-redeploys)
```

### 3. Update Local Files
```bash
# Update backend/.env.local with new key
# (This file is now gitignored)
```

---

## Prevention for Future

### Always use placeholders in docs:
```bash
# ❌ NEVER commit real keys
ANTHROPIC_API_KEY=sk-ant-api03-real-key

# ✅ ALWAYS use placeholders
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### Keep real keys only in:
- ✅ Local `.env.local` files (gitignored)
- ✅ Render environment variables (secure)
- ❌ NEVER in git commits!

---

## Quick Commands

```bash
# 1. Allow secret on GitHub (click the link)
# 2. Push again
git push origin main

# 3. Rotate key immediately
# (Go to Anthropic console)

# 4. Update Render
# (Go to Render dashboard)
```

---

**Use the "Allow Secret" approach - it's safer and faster!**
