# 🧪 Desktop IDE Testing Guide

## How to Test Before Building

Always test in development mode before creating production builds!

---

## 🚀 Quick Start

### **Method 1: Development Mode (Recommended)**

```bash
npm run electron:dev
```

**What happens:**
1. Vite dev server starts (http://localhost:5173 or 3001)
2. Electron window opens automatically
3. Hot reload enabled (changes update instantly!)
4. DevTools open for debugging
5. All errors visible in console

**Benefits:**
- ✅ Instant feedback
- ✅ See errors immediately
- ✅ No need to rebuild
- ✅ Fast iteration
- ✅ Debug with DevTools

---

## 📋 Step-by-Step Testing Process

### **Step 1: Start Development Server**

```bash
npm run electron:dev
```

**Expected output:**
```
VITE v6.4.1  ready in 1234 ms
➜  Local:   http://localhost:5173/

Electron window opened
```

### **Step 2: Test All Features**

Once the Electron window opens, test:

#### **Basic Functionality:**
- [ ] Window opens without errors
- [ ] UI loads correctly
- [ ] Can navigate between pages
- [ ] Menus work (File, Edit, View, etc.)

#### **IDE Features:**
- [ ] File explorer shows
- [ ] Can create/open files
- [ ] Monaco editor loads
- [ ] Syntax highlighting works
- [ ] Terminal opens
- [ ] Can type in terminal

#### **Advanced Features:**
- [ ] NEXI AI responds
- [ ] Wallet connection works
- [ ] Gas analyzer shows data
- [ ] Collaboration features work
- [ ] Settings save correctly

### **Step 3: Check for Errors**

**In Electron DevTools (automatically opens):**
- Check Console tab for errors
- Check Network tab for failed requests
- Check Application tab for storage issues

**In Terminal (where you ran npm run electron:dev):**
- Look for error messages
- Check for warnings
- Note any issues

### **Step 4: Fix Issues**

If you find errors:

1. **Fix the code** in your editor
2. **Save the file**
3. **Changes auto-reload** in Electron window
4. **Test again**

No need to restart! Hot reload handles it.

### **Step 5: Stop Development Server**

When done testing:

```bash
# Press Ctrl+C in terminal
# Or close the Electron window
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: Port Already in Use**

**Error:**
```
Port 5173 is in use, trying another one...
```

**Solution:** Vite will automatically use another port (like 3001). This is fine!

### **Issue 2: Electron Window Doesn't Open**

**Check:**
```bash
# Make sure Vite server started
# Look for: "Local: http://localhost:5173/"
```

**Fix:** Wait a few more seconds, Electron waits for Vite to be ready.

### **Issue 3: White Screen**

**Causes:**
- Vite server not ready
- Wrong port in electron/main.js
- Build errors

**Fix:**
1. Check terminal for errors
2. Check DevTools console
3. Restart: Ctrl+C and run again

### **Issue 4: Module Not Found**

**Error:**
```
Cannot find module 'xyz'
```

**Fix:**
```bash
npm install
npm run electron:dev
```

---

## 🔧 Advanced Testing

### **Test with Different Scenarios:**

#### **1. Test File Operations**

```bash
# In development mode:
# 1. Open file explorer
# 2. Create new file
# 3. Edit file
# 4. Save file
# 5. Check if saved correctly
```

#### **2. Test Terminal**

```bash
# In Electron terminal:
echo "Hello World"
ls -la
# Check if commands work
```

#### **3. Test Keyboard Shortcuts**

- `Ctrl+B` - Toggle sidebar
- `Ctrl+J` - Toggle terminal
- `Ctrl+S` - Save file
- `Ctrl+W` - Close tab

#### **4. Test Menus**

- File → New File
- Edit → Find
- View → Toggle Terminal
- Help → About

---

## 📊 Testing Checklist

### **Before Building:**

- [ ] Tested in development mode
- [ ] All features work
- [ ] No console errors
- [ ] No terminal errors
- [ ] Menus work correctly
- [ ] Keyboard shortcuts work
- [ ] File operations work
- [ ] Terminal works
- [ ] Settings save
- [ ] No crashes

### **After Testing:**

- [ ] All issues fixed
- [ ] Tested fixes in dev mode
- [ ] Ready to build production version

---

## 🎯 Development Workflow

### **Recommended Process:**

```
1. Make changes to code
   ↓
2. npm run electron:dev
   ↓
3. Test in Electron window
   ↓
4. Find issues? → Fix and auto-reload
   ↓
5. Everything works? → Build production
   ↓
6. npm run electron:build:linux
   ↓
7. Test production build
   ↓
8. Distribute to users
```

---

## 🔍 Debugging Tips

### **Enable Verbose Logging:**

Edit `electron/main.js` and add:

```javascript
// At the top
console.log('Electron starting...');

// In createWindow
console.log('Creating window...');

// After window created
console.log('Window created successfully');
```

### **Check Vite Dev Server:**

Open in browser: http://localhost:5173

If it works in browser but not in Electron, the issue is Electron-specific.

### **Check Electron Console:**

DevTools automatically open. Check:
- Console tab for JavaScript errors
- Network tab for failed requests
- Sources tab for debugging

---

## 🚀 Quick Commands Reference

```bash
# Start development mode
npm run electron:dev

# Stop (Ctrl+C or close window)

# If you need to restart
Ctrl+C
npm run electron:dev

# Build after testing
npm run electron:build:linux
npm run electron:build:windows
```

---

## ✅ When to Build Production

**Build production version when:**

✅ All features tested in dev mode  
✅ No errors in console  
✅ No errors in terminal  
✅ All functionality works  
✅ Performance is good  
✅ Ready for users  

**Don't build if:**

❌ Errors in dev mode  
❌ Features not working  
❌ Haven't tested yet  
❌ Still making changes  

---

## 🎊 Summary

**Testing Process:**

1. **Start:** `npm run electron:dev`
2. **Test:** Use the IDE, check all features
3. **Fix:** Make changes, auto-reload
4. **Repeat:** Until everything works
5. **Build:** `npm run electron:build:linux`
6. **Distribute:** Share with users

**Benefits:**
- ✅ Catch errors early
- ✅ Fast iteration
- ✅ No wasted build time
- ✅ Better quality
- ✅ Confident releases

---

**Always test in development mode first!** 🧪
