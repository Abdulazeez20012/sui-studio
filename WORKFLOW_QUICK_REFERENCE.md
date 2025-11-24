# Workflow Integration - Quick Reference

## 🚀 One-Click Actions

### Build
**Button**: Blue "Build" button in toolbar  
**Shortcut**: `Ctrl+B`  
**Action**: Compiles Move code with `sui move build`  
**Output**: Terminal shows build progress  
**Status**: Green ✓ on success, Red ✗ on error

### Test
**Button**: Green "Test" button in toolbar  
**Shortcut**: `Ctrl+T`  
**Action**: Runs tests with `sui move test`  
**Output**: Terminal shows test results  
**Status**: Green ✓ if all pass, Red ✗ if any fail

### Deploy
**Button**: Cyan "Deploy" button in toolbar  
**Shortcut**: `Ctrl+D`  
**Action**: Opens deployment panel  
**Networks**: Testnet, Devnet, Mainnet  
**Output**: Transaction details and explorer link

## 📊 Workflow Phases

### 1. Discover Phase (Blue)
- Define project goals
- Choose template (DeFi/NFT/Gaming)
- Setup environment
- Generate checklist

### 2. Explore Phase (Purple)
- Rapid prototyping
- Gas cost analysis
- Walrus storage integration
- Team collaboration

### 3. Test Phase (Green)
- Automated deployment
- Gas profiling
- CI/CD audits
- Performance metrics

## 🎯 Templates

### DeFi Template
- AMM pools
- Lending protocols
- Yield farming
- Token swaps

### NFT Template
- Collections
- Marketplaces
- Royalty systems
- Metadata handling

### Gaming Template
- Inventory systems
- Achievements
- In-game economies
- Player progression

## 💻 Terminal Commands

```bash
sui move build          # Build package
sui move test           # Run tests
sui move test --filter  # Run specific test
sui client              # Client commands
help                    # Show help
clear                   # Clear terminal
```

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Build | `Ctrl+B` |
| Test | `Ctrl+T` |
| Deploy | `Ctrl+D` |
| Toggle Terminal | `Ctrl+J` |
| Toggle Right Panel | `Ctrl+\` |
| Previous Command | `↑` |
| Next Command | `↓` |

## 🔄 Typical Workflow

```
1. Choose Template → 2. Write Code → 3. Build → 4. Test → 5. Deploy
         ↓                                                      ↓
    Discover Phase                                        Test Phase
                              ↓
                         Explore Phase
```

## ✅ Status Indicators

| Color | Meaning |
|-------|---------|
| 🔵 Blue | Building... |
| 🟢 Green | Success |
| 🔴 Red | Error |
| ⚪ Gray | Idle |

## 🛠️ Quick Fixes

### Build Error
1. Check terminal output
2. Fix syntax errors
3. Click Build again

### Test Failure
1. Review failed test
2. Fix assertion
3. Click Test again

### Deploy Error
1. Ensure build succeeds
2. Check network selection
3. Verify gas budget
4. Try again

## 📍 Component Locations

- **Workflow Integration**: Landing page (after Walrus section)
- **Build/Test/Deploy**: IDE toolbar (top)
- **Terminal**: IDE bottom panel
- **Deployment Panel**: IDE right panel

## 🎨 Visual Cues

- **Neon glow** = Active/Success
- **Pulsing** = Loading
- **Red glow** = Error
- **Gradient** = Primary action

## 🔐 Security

- Commands are whitelisted
- User workspaces isolated
- 60-second timeout
- No cross-user access

## 📦 What's Included

✅ Real terminal execution  
✅ Command history  
✅ Auto-scrolling output  
✅ Syntax highlighting  
✅ One-click build  
✅ One-click test  
✅ One-click deploy  
✅ Multi-network support  
✅ Gas analysis  
✅ Deployment history  
✅ Explorer integration  
✅ Collaborative editing  

---

**Ready to use!** Start building Move smart contracts with the most efficient workflow in Web3.
