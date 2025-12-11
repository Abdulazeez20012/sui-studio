# Build, Test & Publish Functionality - Testing Guide

## ✅ What Was Fixed

### 1. **Build Button**
- Now works with Electron's terminal (no backend required)
- Executes `sui move build` in the current folder
- Shows real-time output in terminal
- Visual feedback (green for success, red for error)
- Auto-opens terminal if closed

### 2. **Test Button**
- Executes `sui move test` in the current folder
- Shows test results in terminal
- Success/error indicators
- Works without backend connection

### 3. **Publish Button**
- Executes `sui client publish --gas-budget 100000000`
- Publishes package to Sui network
- Shows transaction output in terminal
- Requires active Sui wallet configuration

### 4. **Smart Button States**
- Buttons disabled when no folder is open
- Tooltip shows "Open a folder first"
- Works in Electron without backend
- Fallback to backend API for web version

---

## 🧪 How to Test

### Prerequisites
1. ✅ IDE is running (Electron desktop app)
2. ✅ Have a Sui Move project ready
3. ✅ Sui CLI installed (`sui --version`)
4. ✅ Sui wallet configured (for publish)

### Test 1: Build Functionality

**Steps:**
1. Click "Open" button in header
2. Select a Sui Move project folder (with Move.toml)
3. Click the "Build" button (hammer icon)
4. **Expected Results:**
   - Terminal opens automatically
   - Shows `$ sui move build`
   - Displays build output
   - Button turns green if successful
   - Button turns red if failed
   - Build status shows for 3 seconds

**Test Cases:**
- ✅ Build successful project → Green indicator
- ✅ Build project with errors → Red indicator + error output
- ✅ Build without folder open → Button disabled
- ✅ Build while building → Button disabled (prevents double-click)

### Test 2: Test Functionality

**Steps:**
1. Open a Sui Move project with tests
2. Click the "Test" button (test tube icon)
3. **Expected Results:**
   - Terminal opens automatically
   - Shows `$ sui move test`
   - Displays test output
   - Button turns green if all tests pass
   - Button turns red if any test fails
   - Status shows for 3 seconds

**Test Cases:**
- ✅ All tests pass → Green indicator + "✓ Tests passed!"
- ✅ Some tests fail → Red indicator + failure details
- ✅ No tests in project → Shows appropriate message
- ✅ Test without folder open → Button disabled

### Test 3: Publish Functionality

**Steps:**
1. Open a Sui Move project
2. Build the project first (must be successful)
3. Ensure Sui wallet is configured:
   ```bash
   sui client active-address
   ```
4. Click the "Publish" button (cloud upload icon)
5. **Expected Results:**
   - Terminal opens automatically
   - Shows `$ sui client publish --gas-budget 100000000`
   - Displays transaction details
   - Shows package ID if successful
   - Shows error if wallet not configured

**Test Cases:**
- ✅ Publish with configured wallet → Success + package ID
- ✅ Publish without wallet → Error message
- ✅ Publish without building first → May fail with error
- ✅ Publish without folder open → Button disabled

---

## 🎯 Quick Test Scenario

### Create a Test Project

```bash
# Create new Sui Move project
sui move new test_project
cd test_project

# Add a simple module
cat > sources/hello.move << 'EOF'
module test_project::hello {
    use std::string;
    
    public fun greet(): string::String {
        string::utf8(b"Hello, Sui!")
    }
    
    #[test]
    fun test_greet() {
        let greeting = greet();
        assert!(greeting == string::utf8(b"Hello, Sui!"), 0);
    }
}
EOF
```

### Test in IDE

1. **Open the project:**
   - Click "Open" → Select `test_project` folder

2. **Test Build:**
   - Click "Build" button
   - Should see: "Build successful"
   - Terminal shows compilation output

3. **Test Tests:**
   - Click "Test" button
   - Should see: "✓ Tests passed!"
   - Terminal shows test results

4. **Test Publish (Optional):**
   - Configure Sui wallet first
   - Click "Publish" button
   - Should see transaction details

---

## 🐛 Troubleshooting

### Build Button Disabled
**Problem:** Build button is grayed out
**Solution:** 
- Make sure you've opened a folder (Click "Open")
- Check that the folder contains a Move.toml file

### "sui: command not found"
**Problem:** Terminal shows command not found
**Solution:**
```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

### Publish Fails
**Problem:** Publish button shows error
**Solution:**
```bash
# Configure Sui wallet
sui client new-address ed25519
sui client switch --address <your-address>

# Get testnet tokens
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{"FixedAmountRequest":{"recipient":"<your-address>"}}'
```

### Terminal Not Showing Output
**Problem:** Terminal is blank
**Solution:**
- Press Ctrl+J to toggle terminal
- Check that terminal panel is open
- Look for output in the active terminal tab

---

## 📊 Expected Behavior Summary

| Action | Folder Open | Expected Result |
|--------|-------------|-----------------|
| Build | ❌ No | Button disabled, tooltip: "Open a folder first" |
| Build | ✅ Yes | Executes build, shows output, green/red indicator |
| Test | ❌ No | Button disabled, tooltip: "Open a folder first" |
| Test | ✅ Yes | Runs tests, shows results, green/red indicator |
| Publish | ❌ No | Button disabled, tooltip: "Open a folder first" |
| Publish | ✅ Yes | Publishes package, shows transaction details |

---

## ✨ New Features

1. **Visual Feedback:**
   - Loading spinner while executing
   - Green border for success
   - Red border for errors
   - Status persists for 3 seconds

2. **Smart Tooltips:**
   - Hover over buttons to see keyboard shortcuts
   - Disabled buttons show reason

3. **Terminal Integration:**
   - Auto-opens terminal when needed
   - Real-time output streaming
   - Command history preserved

4. **Error Handling:**
   - Clear error messages
   - Full output available in terminal
   - Graceful fallback to backend API (web version)

---

## 🎮 Keyboard Shortcuts

- **Ctrl+Shift+B** - Build project
- **Ctrl+Shift+T** - Run tests
- **Ctrl+J** - Toggle terminal

---

## 📝 Notes

- All commands execute in the opened folder's directory
- Terminal output is real-time (streamed as it happens)
- Multiple clicks are prevented (buttons disable during execution)
- Works offline (no backend required for Electron)
- Web version falls back to backend API if available

---

**Status:** ✅ Ready for Testing  
**Last Updated:** December 11, 2024  
**Version:** 1.0.0
