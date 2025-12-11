# 📖 Sui Studio IDE - User Guide

Welcome to **Sui Studio**, the professional IDE built specifically for Sui Move development!

---

## 🚀 Quick Start

### 1. Open Your Project
1. Click the **"Open"** button in the header
2. Select your Sui Move project folder
3. Files will appear in the explorer on the left

### 2. Edit Files
1. Click any file in the explorer to open it
2. Edit in the Monaco editor (same as VS Code!)
3. Changes auto-save every 5 seconds
4. Or press **Ctrl+S** to save manually

### 3. Build Your Project
1. Open the terminal (bottom panel)
2. Type: `sui move build`
3. Press Enter
4. Watch the build output in real-time!

### 4. Run Tests
1. In the terminal, type: `sui move test`
2. Press Enter
3. See test results immediately

---

## ⌨️ Keyboard Shortcuts

Press **?** anytime to see all shortcuts!

### File Operations
- **Ctrl+S** - Save current file
- **Ctrl+Shift+S** - Save all files
- **Ctrl+W** - Close current tab
- **Ctrl+N** - New file

### View
- **Ctrl+B** - Toggle sidebar
- **Ctrl+J** - Toggle terminal
- **Ctrl+Tab** - Next tab

### Build & Deploy
- **Ctrl+Shift+B** - Build project
- **Ctrl+Shift+T** - Run tests
- **Ctrl+Shift+D** - Deploy

---

## 📁 File Management

### Create New File
1. Right-click in the file explorer
2. Click "New File"
3. Enter filename (e.g., `my_module.move`)
4. File is created on disk immediately

### Create New Folder
1. Right-click in the file explorer
2. Click "New Folder"
3. Enter folder name
4. Folder is created on disk

### Rename File/Folder
1. Right-click the file or folder
2. Click "Rename"
3. Enter new name
4. Press Enter

### Delete File/Folder
1. Right-click the file or folder
2. Click "Delete"
3. Confirm deletion
4. File is permanently deleted from disk

---

## 💻 Terminal

### Execute Commands
The terminal has full shell access! You can run:
- `sui move build` - Build your project
- `sui move test` - Run tests
- `sui --version` - Check Sui version
- `ls` / `dir` - List files
- `git status` - Git commands
- Any other CLI command!

### Built-in Commands
- `clear` - Clear terminal
- `help` - Show help
- `pwd` - Print working directory

### Command History
- **Up Arrow** - Previous command
- **Down Arrow** - Next command

---

## 🎨 UI Features

### File Tabs
- **Blue dot** - File has unsaved changes
- **Asterisk (*)** - Also indicates unsaved changes
- **X button** - Close tab (confirms if unsaved)

### Status Bar (Bottom)
- **Folder name** - Current project folder
- **Git branch** - Current branch (if in git repo)
- **Build status** - Last build result
- **Language** - Current file language

### Panels
- **Left Panel** - File explorer, search, git
- **Right Panel** - AI assistant, deployment, settings
- **Bottom Panel** - Terminal, output, problems

---

## 🤖 AI Assistant (Nexi)

### Open Nexi
1. Click the chat icon in the sidebar
2. Or click "Nexi AI" in the right panel

### What Nexi Can Do
- Generate Move code
- Explain Sui concepts
- Debug errors
- Optimize gas usage
- Answer questions about Sui/Move

### Example Prompts
- "Create an NFT collection contract"
- "Explain how zkLogin works"
- "Why am I getting this error?"
- "Optimize this function for gas"

---

## 🚀 Building & Deploying

### Build Your Project
```bash
sui move build
```

### Run Tests
```bash
sui move test
```

### Deploy to Testnet
1. Make sure you have a Sui wallet connected
2. Click the "Deploy" button in the header
3. Or use the terminal:
```bash
sui client publish --gas-budget 100000000
```

---

## 🐛 Troubleshooting

### "sui: command not found"
**Solution:** Install Sui CLI
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

### Files not saving
**Check:**
- Did you open a folder first?
- Do you have write permissions?
- Look at console for errors (F12)

### Terminal not working
**Check:**
- Are you in the desktop app (not browser)?
- Is the terminal focused?
- Try clicking in the terminal input

### Build errors
**Check:**
- Is your Move.toml correct?
- Are all dependencies installed?
- Run `sui move build` in external terminal to see full errors

---

## 💡 Tips & Tricks

### 1. Auto-Save
Files auto-save every 5 seconds. You'll see the blue dot disappear when saved.

### 2. Multiple Terminals
Click the "+" button in the terminal to open multiple terminals.

### 3. Working Directory
The terminal automatically uses your project folder as the working directory.

### 4. Keyboard Shortcuts
Press **?** to see all keyboard shortcuts. Learn them to work faster!

### 5. AI Assistant
Use Nexi AI for quick help. It knows Sui Move patterns and best practices.

### 6. Recent Projects
Your recently opened folders are saved. Easy to switch between projects.

---

## 🎯 Common Workflows

### Starting a New Project
```bash
# 1. Create project folder
mkdir my-sui-project
cd my-sui-project

# 2. Initialize Sui project
sui move new my_package

# 3. Open in Sui Studio
Click "Open" → Select folder

# 4. Start coding!
```

### Building and Testing
```bash
# 1. Build
sui move build

# 2. Run tests
sui move test

# 3. Fix any errors
# 4. Repeat
```

### Deploying to Testnet
```bash
# 1. Build first
sui move build

# 2. Deploy
sui client publish --gas-budget 100000000

# 3. Copy package ID
# 4. Test your contract
```

---

## 🆘 Getting Help

### In the IDE
- Press **?** for keyboard shortcuts
- Click the **?** icon in the header
- Ask **Nexi AI** for help

### Documentation
- [Sui Documentation](https://docs.sui.io)
- [Move Language Book](https://move-language.github.io/move/)
- [Sui Move by Example](https://examples.sui.io)

### Community
- [Sui Discord](https://discord.gg/sui)
- [Sui Forum](https://forums.sui.io)
- [GitHub Issues](https://github.com/your-repo/sui-studio/issues)

---

## 🎉 You're Ready!

You now know everything you need to be productive with Sui Studio!

**Happy coding!** 🚀

---

## 📝 Quick Reference Card

```
File Operations:
  Ctrl+S          Save file
  Ctrl+Shift+S    Save all
  Ctrl+W          Close tab
  Ctrl+N          New file

View:
  Ctrl+B          Toggle sidebar
  Ctrl+J          Toggle terminal
  Ctrl+Tab        Next tab

Build:
  Ctrl+Shift+B    Build
  Ctrl+Shift+T    Test
  Ctrl+Shift+D    Deploy

Help:
  ?               Show shortcuts
  Click ? icon    Help menu
```

---

**Version:** 1.0.0-beta
**Last Updated:** December 2024
