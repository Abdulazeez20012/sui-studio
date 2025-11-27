# 🚀 Quick Start - Compilation Features

## 30-Second Overview

Three buttons in the toolbar help you check your Move code:

```
┌──────────────────────────────────────────────────┐
│  [🔍 CHECK]  [🔨 BUILD]  [🧪 TEST]  [🚀 DEPLOY] │
│   Purple      Blue       Green     Gradient     │
└──────────────────────────────────────────────────┘
```

---

## 🔍 CHECK (NEW!)
**When:** Quick validation during development  
**Shortcut:** `Ctrl+Shift+B`  
**Shows:** Detailed error popup with context  
**Speed:** ⚡ Fast (< 1 second)

```
Click → See errors → Fix → Click again
```

---

## 🔨 BUILD
**When:** Full project build  
**Shortcut:** `Ctrl+B`  
**Shows:** Terminal output + error popup  
**Speed:** 🐢 Slower (1-5 seconds)

```
Click → Terminal opens → See full output
```

---

## 🧪 TEST
**When:** Run test suite  
**Shortcut:** `Ctrl+T`  
**Shows:** Test results in terminal  
**Speed:** 🐢 Depends on tests

```
Click → Tests run → See pass/fail
```

---

## 🚀 DEPLOY
**When:** Publish to network  
**Shortcut:** `Ctrl+D`  
**Shows:** Deployment panel  
**Speed:** 🐌 Slowest (5-30 seconds)

```
Click → Compiles → Signs → Publishes
```

---

## 💡 Error Popup Features

### Click the ▼ arrow to expand:
- Individual error messages
- File locations (file:line:column)
- Code context (surrounding lines)
- Full compiler output

### Example:
```
❌ Build Failed                    [▼] [×]
─────────────────────────────────────────
Errors:

Expected ';' after statement
sources/main.move:42:15
▶ Show context

▶ Full Output
```

---

## 🎯 Recommended Workflow

### During Development:
```
1. Write code
2. 🔍 CHECK (quick validation)
3. Fix errors
4. Repeat 2-3 until clean
```

### Before Committing:
```
1. 🔨 BUILD (full build)
2. 🧪 TEST (run tests)
3. Commit if both pass
```

### For Deployment:
```
1. 🔨 BUILD (ensure clean)
2. 🧪 TEST (verify tests)
3. 🚀 DEPLOY (publish)
```

---

## ⚡ Pro Tips

1. **Use CHECK often** - It's fast and gives detailed feedback
2. **Expand error context** - Click "Show context" to see surrounding code
3. **Read full output** - Sometimes has additional hints
4. **Build before deploy** - Catches issues early
5. **Keep terminal open** - See real-time output

---

## 🎨 Color Guide

- 🟣 **Purple** = Quick check
- 🔵 **Blue** = Full build
- 🟢 **Green** = Tests/Success
- 🔴 **Red** = Errors
- 🌈 **Gradient** = Deploy

---

## 🆘 Common Issues

### "Compilation failed" but no details?
→ Click the ▼ arrow to expand errors

### Errors not showing in popup?
→ Check the terminal for output

### Build taking too long?
→ Use CHECK instead for quick validation

### Can't see full error message?
→ Click "Show full output"

---

## 📚 More Info

- **Full Documentation:** `COMPILATION_ERROR_REPORTING.md`
- **Visual Guide:** `COMPILATION_FEATURES_VISUAL_GUIDE.md`
- **Implementation:** `IMPLEMENTATION_COMPLETE_COMPILATION.md`

---

## ✅ Quick Checklist

Before deploying, make sure:
- [ ] 🔍 CHECK passes
- [ ] 🔨 BUILD succeeds
- [ ] 🧪 TESTS pass
- [ ] Wallet connected
- [ ] Sufficient balance

---

**That's it! Start with CHECK and work your way up.** 🎉
