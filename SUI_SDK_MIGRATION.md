# Sui TypeScript SDK Migration Guide

## 🔄 Migration from @mysten/sui.js to @mysten/sui

Your project is currently using the **deprecated** `@mysten/sui.js@0.54.1` package. You need to migrate to the new `@mysten/sui` package.

---

## ⚠️ Current Issue

```json
"@mysten/sui.js": "^0.54.1"  // ❌ DEPRECATED
```

**Warning from npm:**
```
npm warn deprecated @mysten/sui.js@0.54.1: This package has been renamed to @mysten/sui
```

---

## ✅ Solution: Update to New SDK

### Step 1: Uninstall Old Package

```bash
npm uninstall @mysten/sui.js
```

### Step 2: Install New Package

```bash
npm install @mysten/sui@latest
```

### Step 3: Update Imports

**Old imports (❌ Remove):**
```typescript
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
```

**New imports (✅ Use):**
```typescript
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
```

---

## 📝 Key Changes

### 1. TransactionBlock → Transaction

**Old:**
```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';

const tx = new TransactionBlock();
tx.moveCall({ ... });
```

**New:**
```typescript
import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();
tx.moveCall({ ... });
```

### 2. Pure Arguments

**Old:**
```typescript
tx.pure(value)
tx.pure(value, type)
```

**New:**
```typescript
tx.pure.u64(value)
tx.pure.u8(value)
tx.pure.address(value)
tx.pure.bool(value)
tx.pure.string(value)
```

### 3. Client Import

**Old:**
```typescript
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
```

**New:**
```typescript
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
```

---

## 🔧 Files That Need Updates

### Frontend Files

1. **`src/services/subscriptionService.ts`** ✅ Already updated
2. **`src/services/deploymentService.ts`** - Needs update
3. **`src/services/suiService.ts`** - Needs update
4. **`src/hooks/useSuiWallet.ts`** - Check imports
5. **`src/providers/WalletProvider.tsx`** - Check imports

### Backend Files

1. **`backend/src/routes/sui.ts`** - Needs update
2. **`backend/src/routes/deploy.ts`** - Needs update
3. **`backend/package.json`** - Update dependency

---

## 🚀 Quick Migration Script

Run these commands:

```bash
# Frontend
npm uninstall @mysten/sui.js
npm install @mysten/sui@latest

# Backend
cd backend
npm uninstall @mysten/sui.js
npm install @mysten/sui@latest
cd ..
```

---

## 📦 Updated package.json

**Before:**
```json
{
  "dependencies": {
    "@mysten/sui.js": "^0.54.1"
  }
}
```

**After:**
```json
{
  "dependencies": {
    "@mysten/sui": "^1.14.0"
  }
}
```

---

## ✅ Verification

After migration, verify everything works:

```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build

# Run tests
npm test
```

---

## 🔗 Official Documentation

- **New SDK Docs:** https://sdk.mystenlabs.com/typescript
- **Migration Guide:** https://sdk.mystenlabs.com/typescript/migrations
- **GitHub:** https://github.com/MystenLabs/sui/tree/main/sdk/typescript

---

## 📋 Checklist

- [ ] Uninstall `@mysten/sui.js` from frontend
- [ ] Uninstall `@mysten/sui.js` from backend
- [ ] Install `@mysten/sui` in frontend
- [ ] Install `@mysten/sui` in backend
- [ ] Update all imports from `/sui.js/` to `/sui/`
- [ ] Change `TransactionBlock` to `Transaction`
- [ ] Update `tx.pure()` to `tx.pure.u64()` etc.
- [ ] Test subscription service
- [ ] Test deployment service
- [ ] Run full test suite
- [ ] Rebuild and verify

---

**Status:** Ready to migrate  
**Estimated Time:** 15-30 minutes  
**Breaking Changes:** Import paths and Transaction API
