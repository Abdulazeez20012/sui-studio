# 🔍 Wallet Detection Debug Guide

## Issue: Wallet Not Detected

If you have a Sui wallet installed but the IDE says "No Sui wallet detected", follow these steps:

---

## ✅ Quick Fixes

### 1. Refresh the Page
The simplest solution - just refresh your browser:
```
Press F5 or Ctrl+R (Cmd+R on Mac)
```

### 2. Check Wallet Extension is Enabled
1. Open browser extensions (chrome://extensions or edge://extensions)
2. Find your Sui wallet extension
3. Make sure it's **enabled** (toggle should be ON)
4. Refresh the page

### 3. Check Wallet is Unlocked
1. Click the wallet extension icon in your browser
2. If it asks for password, unlock it
3. Refresh the IDE page

---

## 🔧 Supported Wallets

The IDE now supports these wallets:

| Wallet | Detection Key | Status |
|--------|---------------|--------|
| **Sui Wallet** | `window.suiWallet` or `window.sui` | ✅ Supported |
| **Suiet** | `window.suiet` | ✅ Supported |
| **Ethos** | `window.ethos` | ✅ Supported |
| **Slush** | `window.slush` | ✅ Supported |

---

## 🐛 Debug Steps

### Step 1: Check if Wallet is Injected

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Type and run:

```javascript
// Check for Slush wallet
console.log('Slush:', window.slush);

// Check for Sui Wallet
console.log('Sui Wallet:', window.suiWallet);
console.log('Sui:', window.sui);

// Check for Suiet
console.log('Suiet:', window.suiet);

// Check for Ethos
console.log('Ethos:', window.ethos);
```

**Expected Result**: You should see an object (not `undefined`)

**If you see `undefined`**:
- The wallet extension is not injecting properly
- Try disabling and re-enabling the extension
- Try reinstalling the wallet extension

### Step 2: Check Wallet Methods

If the wallet object exists, check if it has the required methods:

```javascript
// For Slush wallet
console.log('Slush methods:', Object.keys(window.slush || {}));

// Check for requestPermissions method
console.log('Has requestPermissions:', typeof window.slush?.requestPermissions);
```

**Expected Result**: Should show available methods including `requestPermissions`

### Step 3: Test Manual Connection

Try connecting manually in the console:

```javascript
// For Slush wallet
window.slush.requestPermissions()
  .then(accounts => console.log('Connected:', accounts))
  .catch(error => console.error('Error:', error));
```

**If this works**: The wallet is functional, there might be a timing issue
**If this fails**: Check the error message for clues

---

## 🔄 Common Issues & Solutions

### Issue 1: Wallet Loads After Page
**Problem**: Wallet extension injects after the page loads

**Solution**: Add a delay or wait for wallet to load

**Temporary Fix**: Refresh the page after it fully loads

### Issue 2: Multiple Wallets Conflict
**Problem**: Multiple wallet extensions installed causing conflicts

**Solution**: 
1. Disable all Sui wallets except one
2. Refresh the page
3. Try connecting

### Issue 3: Browser Compatibility
**Problem**: Some wallets don't work in certain browsers

**Solution**:
- Slush works best in Chrome/Brave
- Try a different browser
- Check wallet's official documentation

### Issue 4: Extension Permissions
**Problem**: Wallet doesn't have permission to inject scripts

**Solution**:
1. Go to extension settings
2. Check "Site access" permissions
3. Set to "On all sites" or add your IDE URL
4. Refresh the page

---

## 🛠️ Advanced Debugging

### Check Wallet Injection Timing

Add this to your console to monitor when wallets load:

```javascript
// Monitor wallet injection
const checkWallet = setInterval(() => {
  if (window.slush) {
    console.log('✅ Slush wallet detected!');
    clearInterval(checkWallet);
  } else {
    console.log('⏳ Waiting for Slush wallet...');
  }
}, 500);

// Stop after 10 seconds
setTimeout(() => clearInterval(checkWallet), 10000);
```

### Check Network Requests

1. Open DevTools → Network tab
2. Refresh the page
3. Look for any failed requests from the wallet extension
4. Check console for any error messages

---

## 📝 Reporting Issues

If wallet still doesn't work, collect this info:

```javascript
// Copy this debug info
const debugInfo = {
  browser: navigator.userAgent,
  wallets: {
    slush: !!window.slush,
    suiWallet: !!window.suiWallet,
    sui: !!window.sui,
    suiet: !!window.suiet,
    ethos: !!window.ethos,
  },
  slushMethods: window.slush ? Object.keys(window.slush) : [],
  timestamp: new Date().toISOString()
};

console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
```

Share this info when reporting the issue.

---

## 🎯 Slush Wallet Specific

### Slush Wallet Detection

The IDE checks for Slush wallet at:
```javascript
window.slush
```

### Slush Connection Flow

1. **Detection**: Check if `window.slush` exists
2. **Request Permissions**: Call `window.slush.requestPermissions()`
3. **Get Accounts**: Receive array of accounts
4. **Store Connection**: Save address and public key

### Slush Wallet Requirements

- Must be installed and enabled
- Must be unlocked
- Must grant permissions when prompted
- Must be on a supported network (testnet/mainnet)

---

## 🔗 Useful Links

- **Slush Wallet**: Check their official documentation
- **Sui Wallet**: https://chrome.google.com/webstore
- **Suiet**: https://suiet.app
- **Ethos**: https://ethoswallet.xyz

---

## ✨ After Fixing

Once your wallet is detected:

1. Click "Connect Wallet" button
2. Select your wallet from the list
3. Approve the connection in the wallet popup
4. Your address and balance will appear

---

## 🆘 Still Not Working?

Try these last resort options:

1. **Clear Browser Cache**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Refresh the page

2. **Reinstall Wallet Extension**
   - Remove the extension
   - Restart browser
   - Reinstall from official source
   - Restore your wallet

3. **Try Different Browser**
   - Chrome
   - Brave
   - Edge
   - Firefox (if wallet supports it)

4. **Check Wallet Version**
   - Make sure you have the latest version
   - Update if needed

5. **Contact Wallet Support**
   - Check wallet's Discord/Telegram
   - Report the issue to wallet developers

---

## 📊 Success Checklist

- [ ] Wallet extension installed
- [ ] Wallet extension enabled
- [ ] Wallet unlocked
- [ ] Page refreshed
- [ ] Console shows wallet object
- [ ] No console errors
- [ ] Wallet appears in connect menu
- [ ] Connection successful
- [ ] Address displayed
- [ ] Balance shown

---

*If you've tried everything and it still doesn't work, the issue might be with the wallet extension itself. Contact the wallet's support team.*
