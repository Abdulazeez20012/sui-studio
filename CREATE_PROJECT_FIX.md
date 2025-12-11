# Create Project Feature - Fixed & Installation Guide

## 🎯 Issue Identified

When clicking "Create" to create a new Sui Move project, you get an error:
```
/bin/bash: line 1: sui: command not found
```

**Root Cause:** The Sui CLI is not installed on your system.

---

## ✅ What Was Fixed

### 1. NewProjectDialog Component
- ✅ Now uses Electron terminal to execute `sui move new <project_name>`
- ✅ Shows helpful error message when Sui CLI is not found
- ✅ Provides installation instructions in the error message
- ✅ Better error display with multi-line support

### 2. Error Handling
- ✅ Detects "command not found" errors
- ✅ Shows installation instructions directly in the dialog
- ✅ Links to detailed installation guide

---

## 🚀 Solution: Install Sui CLI

### Quick Installation (Automated)

**Run the installation script:**
```bash
./install-sui-cli.sh
```

This script will:
1. Check if Rust is installed (install if needed)
2. Install Sui CLI via cargo
3. Verify the installation
4. Show next steps

**Time:** 10-20 minutes (mostly compilation time)

---

### Manual Installation

**Step 1: Install Rust (if not installed)**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Step 2: Install Sui CLI**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

**Step 3: Verify Installation**
```bash
sui --version
```

**Step 4: Restart Terminal & IDE**
```bash
# Close and reopen your terminal
# Then restart Sui Studio IDE
```

---

## 🧪 Test After Installation

### 1. Verify Sui CLI Works

```bash
# Check version
sui --version

# Should output: sui 1.x.x-xxxxx
```

### 2. Test in IDE

1. **Open Sui Studio IDE**
2. **Click "Create" button** in the header
3. **Enter project name** (e.g., "my_first_project")
4. **Select template** (e.g., "Hello World")
5. **Choose folder** where to create the project
6. **Click "Create Project"**

**Expected Result:**
- ✅ Project created successfully
- ✅ Success message shown
- ✅ IDE prompts to open the new project

---

## 📋 What Happens When You Click Create

### Before Fix (Broken):
```
User clicks "Create"
  ↓
Tries to call backend API
  ↓
Backend not available
  ↓
❌ "Request failed" error
```

### After Fix (Working):
```
User clicks "Create"
  ↓
Opens folder selection dialog
  ↓
Executes: sui move new <project_name>
  ↓
If Sui CLI not found:
  ↓
Shows installation instructions
  ↓
If Sui CLI found:
  ↓
✅ Creates project successfully
```

---

## 🎨 New Features

### 1. Better Error Messages
- Clear indication when Sui CLI is missing
- Step-by-step installation instructions
- Link to detailed guide

### 2. Folder Selection
- Choose where to create the project
- Works with any folder on your system
- Creates project in selected location

### 3. Success Feedback
- Visual success animation
- Auto-prompts to open new project
- Smooth user experience

---

## 🐛 Troubleshooting

### "sui: command not found" after installation

**Solution 1: Restart terminal**
```bash
source ~/.bashrc  # or ~/.zshrc
```

**Solution 2: Check PATH**
```bash
echo $PATH | grep cargo
# If not found, add it:
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Solution 3: Verify installation location**
```bash
which sui
# Should output: /home/username/.cargo/bin/sui
```

### Installation takes too long

**Alternative: Download pre-built binary**
```bash
# Check releases page
# https://github.com/MystenLabs/sui/releases
```

### Permission errors

**Solution: Use user directory**
```bash
# Cargo installs to ~/.cargo/bin by default
# No sudo needed
```

---

## 📚 Documentation Created

1. **`SUI_CLI_INSTALLATION_GUIDE.md`** - Complete installation guide
2. **`install-sui-cli.sh`** - Automated installation script
3. **`CREATE_PROJECT_FIX.md`** - This document

---

## 🎯 Next Steps

### 1. Install Sui CLI
```bash
./install-sui-cli.sh
```

### 2. Restart Everything
- Close terminal
- Reopen terminal
- Restart Sui Studio IDE

### 3. Test Create Feature
- Click "Create"
- Enter project name
- Select folder
- Create project

### 4. Start Coding!
- Open the created project
- Edit Move files
- Build, test, publish

---

## ✨ Additional Setup (Optional)

### Initialize Sui Client
```bash
sui client
```

### Create Wallet Address
```bash
sui client new-address ed25519
```

### Get Testnet Tokens
```bash
sui client faucet
```

### Check Balance
```bash
sui client gas
```

---

**Status:** ✅ Fixed - Requires Sui CLI Installation  
**Installation Time:** 10-20 minutes  
**Difficulty:** Easy (automated script available)

---

**Ready to install?**
```bash
./install-sui-cli.sh
```
