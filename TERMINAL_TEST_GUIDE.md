# 🧪 Terminal Test Guide - Phase 2

## ⚡ 3-Minute Terminal Test

### Test the Real Terminal Now!

The Electron app should have hot-reloaded with terminal integration. Here's what to test:

---

## 1️⃣ Basic Command (30 seconds)

**Steps:**
1. Look at the terminal (bottom panel)
2. Type: `echo "Hello from Sui Studio!"`
3. Press Enter ✅

**Expected:**
- Command executes immediately
- Output appears: `Hello from Sui Studio!`
- Prompt returns for next command

---

## 2️⃣ Check Sui CLI (30 seconds)

**Steps:**
1. Type: `sui --version`
2. Press Enter ✅

**Expected:**
- Shows Sui version (e.g., `sui 1.15.0`)
- If not installed: Shows error message

**If Sui not installed:**
```bash
# Install Sui CLI first
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

---

## 3️⃣ List Files (30 seconds)

**Steps:**
1. Type: `ls` (Mac/Linux) or `dir` (Windows)
2. Press Enter ✅

**Expected:**
- Shows files in current folder
- Real-time output
- Matches actual folder contents

---

## 4️⃣ Working Directory (30 seconds)

**Steps:**
1. Look at bottom of terminal
2. See "Working Directory: [folder name]" ✅
3. Type: `pwd` (Mac/Linux) or `cd` (Windows)
4. Press Enter ✅

**Expected:**
- Shows full path to current folder
- Matches the folder you opened

---

## 5️⃣ Build a Sui Project (1 minute)

**Prerequisites:** Open a Sui Move project folder

**Steps:**
1. Type: `sui move build`
2. Press Enter ✅
3. Watch output appear line by line

**Expected:**
- See "BUILDING MoveStdlib"
- See "BUILDING Sui"
- See "BUILDING [your_package]"
- See "Build Successful" (or errors if any)
- Real-time output streaming

---

## 6️⃣ Run Tests (30 seconds)

**Prerequisites:** Project with tests

**Steps:**
1. Type: `sui move test`
2. Press Enter ✅

**Expected:**
- See "Running Move unit tests"
- See test results
- Pass/fail status
- Real-time output

---

## 7️⃣ Command History (30 seconds)

**Steps:**
1. Type any command and execute
2. Press **Up Arrow** ✅
3. See previous command
4. Press **Down Arrow** ✅
5. Input clears

**Expected:**
- Up arrow shows previous commands
- Down arrow moves forward
- Works like a real terminal

---

## 8️⃣ Error Handling (30 seconds)

**Steps:**
1. Type: `invalid-command-that-does-not-exist`
2. Press Enter ✅

**Expected:**
- Error message in red
- "command not found" or similar
- Terminal still works
- Can type next command

---

## ✅ Success Checklist

After testing, you should be able to:

- [ ] Execute basic commands (echo, ls, pwd)
- [ ] See real-time output
- [ ] Run Sui CLI commands
- [ ] Build Sui Move projects
- [ ] Run tests
- [ ] See working directory
- [ ] Use command history (up/down arrows)
- [ ] Handle errors gracefully
- [ ] Clear terminal (type `clear`)
- [ ] Get help (type `help`)

---

## 🎉 If All Tests Pass:

**Congratulations!** Your terminal now has:
- ✅ Real shell integration
- ✅ Sui CLI access
- ✅ Build capabilities
- ✅ Test execution
- ✅ Professional workflow

---

## 🐛 Common Issues & Solutions

### Issue 1: "sui: command not found"
**Solution:** Install Sui CLI
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

### Issue 2: Commands don't execute
**Check:**
- Are you in the Electron app (not browser)?
- Is the terminal focused?
- Try clicking in the terminal input

### Issue 3: No output appears
**Check:**
- Wait a moment (some commands take time)
- Check console for errors
- Try a simple command like `echo test`

### Issue 4: Working directory not showing
**Check:**
- Did you open a folder first?
- Look at status bar (bottom left)
- Try typing `pwd` to see current directory

---

## 🚀 Advanced Tests

### Test Git Commands
```bash
$ git status
$ git log --oneline -5
$ git branch
```

### Test Node/NPM
```bash
$ node --version
$ npm --version
```

### Test Python
```bash
$ python --version
$ python3 --version
```

### Test Multiple Commands
```bash
$ echo "First command"
$ echo "Second command"
$ echo "Third command"
```

### Test Long-Running Command
```bash
$ sui move build
# Watch output stream in real-time
```

---

## 📊 What Changed?

### Before:
```
❌ Terminal is just UI mockup
❌ Commands don't execute
❌ Can't run Sui CLI
❌ Can't build projects
```

### After:
```
✅ Real shell integration
✅ Execute any command
✅ Run Sui CLI
✅ Build and test projects
✅ Real-time output
✅ Professional terminal
```

---

## 🎯 Real-World Workflow

### Typical Development Session:
```bash
# 1. Check Sui version
$ sui --version

# 2. Build project
$ sui move build

# 3. Run tests
$ sui move test

# 4. Check git status
$ git status

# 5. Commit changes
$ git add .
$ git commit -m "Add new feature"

# 6. Deploy to testnet
$ sui client publish --gas-budget 100000000
```

**All without leaving the IDE!** 🎉

---

## 🎊 You Now Have:

1. ✅ **Full File System** - Create, edit, save files
2. ✅ **Real Terminal** - Execute any command
3. ✅ **Sui CLI Integration** - Build and test
4. ✅ **Professional IDE** - Everything you need

**This is a COMPLETE development environment!** 🚀

---

## 🎯 Next: Find & Replace

Once you've tested the terminal, we can add:
- Find in file (Ctrl+F)
- Replace functionality
- Search across files
- Regex support

**Ready to continue?** Or want to polish what we have? 🎨
