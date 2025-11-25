# 🚀 Wallet & Contract Integration - Quick Start

## ✅ What's New

Your IDE now has **REAL blockchain integration**!

- ✅ Connect Sui wallets (Sui Wallet, Suiet, Ethos)
- ✅ View balance and address
- ✅ Call smart contract functions
- ✅ View object state
- ✅ Monitor events
- ✅ Inspect owned objects
- ✅ Sign real transactions

---

## 🎯 5-Minute Setup

### Step 1: Install a Wallet (2 minutes)

Choose one:

**Sui Wallet** (Recommended)
- Visit: https://chrome.google.com/webstore
- Search: "Sui Wallet"
- Click "Add to Chrome"
- Create new wallet or import existing

**Suiet**
- Visit: https://suiet.app
- Download extension
- Set up wallet

**Ethos**
- Visit: https://ethoswallet.xyz
- Install extension
- Create wallet

### Step 2: Get Testnet SUI (1 minute)

1. Copy your wallet address
2. Join Sui Discord: https://discord.gg/sui
3. Go to #testnet-faucet channel
4. Type: `!faucet YOUR_ADDRESS`
5. Wait for SUI to arrive (~30 seconds)

### Step 3: Connect in IDE (1 minute)

1. Open your IDE
2. Click the panels menu (top right)
3. Select "Wallet"
4. Click "Connect [Your Wallet]"
5. Approve in wallet popup
6. Done! Your balance will appear

### Step 4: Try Contract Interaction (1 minute)

1. Click panels menu → "Contract Interaction"
2. Try this example:
   ```
   Package ID: 0x2
   Module Name: coin
   Function Name: balance
   Arguments: (leave empty for now)
   ```
3. Click "Execute Function"
4. Approve in wallet
5. See the result!

---

## 📱 Quick Actions

### Connect Wallet
```
Toolbar → Panels Menu → Wallet → Connect
```

### View Balance
```
Wallet Panel → Balance (auto-refreshes every 30s)
```

### Copy Address
```
Wallet Panel → Address → Copy Icon
```

### Call Function
```
Panels Menu → Contract Interaction → Call Function Tab
```

### View Object
```
Contract Interaction → View State Tab → Enter Object ID → Fetch
```

### See Events
```
Contract Interaction → Events Tab → Enter Package/Module → Fetch Events
```

### View Your Objects
```
Contract Interaction → Objects Tab → Fetch My Objects
```

---

## 💡 Common Use Cases

### 1. Transfer SUI

```
Panel: Contract Interaction → Call Function

Package ID: 0x2
Module: sui
Function: transfer
Arguments: ["0xRECIPIENT_ADDRESS", 1000000000]

Note: 1000000000 = 1 SUI (9 decimals)
```

### 2. Check Coin Balance

```
Panel: Contract Interaction → View State

Object ID: 0xYOUR_COIN_OBJECT_ID
Click: Fetch

Result: Shows balance and coin details
```

### 3. View Your NFTs

```
Panel: Contract Interaction → Objects Tab

Click: Fetch My Objects

Result: Lists all objects you own
```

### 4. Monitor Contract Events

```
Panel: Contract Interaction → Events Tab

Package ID: 0xYOUR_PACKAGE_ID
Module: your_module

Click: Fetch Events

Result: Shows all events from that contract
```

---

## 🎨 UI Overview

### Wallet Panel

```
┌─────────────────────────────┐
│ 🔗 Wallet                   │
├─────────────────────────────┤
│ Connected to: Sui Wallet    │
│                             │
│ Address:                    │
│ 0x1234...5678 [📋]         │
│                             │
│ Balance:                    │
│ 10.5000 SUI [🔄]           │
│                             │
│ [Request Testnet SUI]       │
│ [View on Explorer]          │
│                             │
│ Network: Testnet ●          │
└─────────────────────────────┘
```

### Contract Interaction Panel

```
┌─────────────────────────────┐
│ 💻 Contract Interaction     │
├─────────────────────────────┤
│ [Call] [View] [Events] [Obj]│
├─────────────────────────────┤
│                             │
│ Package ID: ____________    │
│ Module: ________________    │
│ Function: ______________    │
│ Arguments: _____________    │
│                             │
│ [Execute Function]          │
│                             │
│ Result:                     │
│ ┌─────────────────────────┐ │
│ │ Success! ✓              │ │
│ │ Digest: 0xABC...        │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 🔧 Keyboard Shortcuts

```
Ctrl/Cmd + Shift + W  - Toggle Wallet Panel
Ctrl/Cmd + Shift + C  - Toggle Contract Panel
Ctrl/Cmd + R          - Refresh Balance
```

*(Note: Configure these in Settings)*

---

## 🐛 Troubleshooting

### "No Sui wallet detected"
→ Install a wallet extension and refresh page

### "Connection failed"
→ Make sure wallet is unlocked and approve the connection

### "Balance shows 0"
→ Get testnet SUI from Discord faucet

### "Transaction failed"
→ Check you have enough SUI for gas fees

### "Object not found"
→ Verify the object ID is correct and exists on testnet

---

## 📚 Learn More

### Documentation
- Full Guide: `WALLET_CONTRACT_INTEGRATION.md`
- Sui Docs: https://docs.sui.io
- Wallet Docs: Check your wallet's website

### Examples
- Example contracts in project templates
- Test with deployed contracts on testnet
- Explore Sui Explorer for live contracts

### Support
- Sui Discord: https://discord.gg/sui
- GitHub Issues: (your repo)
- Documentation: (your docs)

---

## ✨ What You Can Build Now

### 1. NFT Marketplace
- Mint NFTs
- List for sale
- Buy/sell
- Transfer ownership

### 2. DeFi Protocol
- Swap tokens
- Provide liquidity
- Stake tokens
- Claim rewards

### 3. Gaming
- Mint game items
- Trade assets
- Level up characters
- Claim achievements

### 4. DAO
- Create proposals
- Vote on decisions
- Execute proposals
- Manage treasury

---

## 🎉 You're Ready!

**Everything is set up and working!**

1. ✅ Wallet integration complete
2. ✅ Contract interaction ready
3. ✅ Real blockchain connection
4. ✅ Professional UI
5. ✅ Security best practices

**Start building on Sui!** 🚀

---

## 🔗 Quick Links

- **Get Testnet SUI**: https://discord.gg/sui (#testnet-faucet)
- **Sui Explorer**: https://suiexplorer.com
- **Sui Docs**: https://docs.sui.io
- **Sui Wallet**: https://chrome.google.com/webstore
- **Suiet**: https://suiet.app
- **Ethos**: https://ethoswallet.xyz

---

*Ready to build amazing dApps on Sui!* 🌟
