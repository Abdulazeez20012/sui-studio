# 🔧 Complete Guide: Rewrite Git History to Remove API Keys

## ⚠️ IMPORTANT WARNINGS

**Before you proceed:**
- ✅ Make sure you're the only person working on this repo
- ✅ This will rewrite ALL git history
- ✅ Requires force push (can't be undone easily)
- ✅ Anyone who cloned your repo will need to re-sync
- ✅ All forks will be out of sync

**If you're not sure, use Option 1 (Allow Secret) instead!**

---

## Step-by-Step Instructions

### Step 1: Install git-filter-repo

**Windows (PowerShell):**
```powershell
pip install git-filter-repo
# OR
pip3 install git-filter-repo
```

**Verify installation:**
```powershell
git-filter-repo --version
```

### Step 2: Backup Your Current State

```powershell
# Create a backup branch
git branch backup-before-history-rewrite

# Verify backup exists
git branch
```

### Step 3: Run the Rewrite Script

**Option A: Use the automated script (RECOMMENDED)**

```powershell
# Make script executable and run
.\rewrite-history.bat
```

**Option B: Manual commands**

```powershell
# 1. Create replacement file
@"
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==>your-anthropic-api-key-here
npg_MdO9AVl3QyUN==>your-neon-password-here
"@ | Out-File -FilePath secrets-to-remove.txt -Encoding ASCII

# 2. Run git-filter-repo
git filter-repo --replace-text secrets-to-remove.txt --force

# 3. Clean up
Remove-Item secrets-to-remove.txt
```

### Step 4: Verify the Rewrite

```powershell
# Check recent commits
git log --all --oneline | Select-Object -First 20

# Search for the API key (should return nothing)
git log --all -p | Select-String "sk-ant-api03-LLbBMK5Q"
```

**Expected:** No results found

### Step 5: Force Push to GitHub

```powershell
# Add remote (git-filter-repo removes it)
git remote add origin https://github.com/Abdulazeez20012/sui-studio.git

# Force push
git push origin main --force
```

### Step 6: IMMEDIATELY Rotate API Key

1. **Go to Anthropic Console:**
   ```
   https://console.anthropic.com/settings/keys
   ```

2. **Delete the old key:**
   ```
   sk-ant-api03-LLbBMK5Q7dHIDU8j1VQnveYGSRAeWnFMnJfT...
   ```

3. **Generate new key**

4. **Update Render:**
   - Go to https://dashboard.render.com
   - Your service → Environment
   - Update `ANTHROPIC_API_KEY` with new key
   - Save (auto-redeploys)

5. **Update local files:**
   ```powershell
   # Edit backend/.env.local with new key
   # (This file is gitignored now)
   ```

---

## Troubleshooting

### Error: "git-filter-repo not found"

**Solution:**
```powershell
# Install Python if not installed
# Then install git-filter-repo
pip install git-filter-repo

# If pip doesn't work, try pip3
pip3 install git-filter-repo

# Or install via scoop (Windows)
scoop install git-filter-repo
```

### Error: "refusing to overwrite"

**Solution:**
```powershell
# The --force flag is required
git filter-repo --replace-text secrets-to-remove.txt --force
```

### Error: "remote origin already exists"

**Solution:**
```powershell
# Remove and re-add remote
git remote remove origin
git remote add origin https://github.com/Abdulazeez20012/sui-studio.git
```

### Push still blocked by GitHub

**Solution:**
```powershell
# Verify the secret is actually removed
git log --all -p | Select-String "sk-ant-api03"

# If still found, the replacement didn't work
# Check your secrets-to-remove.txt file format
```

---

## If Something Goes Wrong

### Restore from Backup

```powershell
# Switch to backup branch
git checkout backup-before-history-rewrite

# Delete the failed main branch
git branch -D main

# Recreate main from backup
git checkout -b main

# Force push to restore
git push origin main --force
```

### Start Over

```powershell
# Delete local repo
cd ..
Remove-Item -Recurse -Force sui-studio

# Re-clone from GitHub
git clone https://github.com/Abdulazeez20012/sui-studio.git
cd sui-studio

# Try again or use Option 1 (Allow Secret)
```

---

## Verification Checklist

After force push succeeds:

- [ ] GitHub push successful (no secret scanning error)
- [ ] API key rotated on Anthropic console
- [ ] Render updated with new API key
- [ ] Local `.env.local` updated with new key
- [ ] Backend deploys successfully on Render
- [ ] Frontend can connect to backend
- [ ] No secrets in git history: `git log --all -p | Select-String "sk-ant"`

---

## Alternative: Use GitHub's Allow Secret

If this seems too risky or complex:

1. Click the GitHub link to allow the secret
2. Push successfully
3. Immediately rotate the API key
4. Much simpler and safer!

---

## Summary of Commands

```powershell
# 1. Install tool
pip install git-filter-repo

# 2. Backup
git branch backup-before-history-rewrite

# 3. Run script
.\rewrite-history.bat

# 4. Verify
git log --all -p | Select-String "sk-ant-api03"

# 5. Add remote
git remote add origin https://github.com/Abdulazeez20012/sui-studio.git

# 6. Force push
git push origin main --force

# 7. Rotate API key immediately!
```

---

**Good luck! Remember to rotate your API key immediately after pushing!**
