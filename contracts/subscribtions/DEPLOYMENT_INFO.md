# 🚀 Subscription Contract - DEPLOYED

## ✅ Deployment Status: LIVE ON SUI TESTNET

**Transaction Digest:** `6n9y9a7sGxHU6iZEFZ5s1WCtZDXvjBeBdHtmED4ZE5T8`

**Deployed:** December 3, 2025  
**Network:** Sui Testnet  
**Status:** Success ✅

---

## 📦 Contract Information

### Package ID
```
0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4
```

### Treasury (Shared Object)
```
0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24
```

### PricingConfig (Shared Object)
```
0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274
```

### AdminCap (Your Object)
```
0x6d08b64cc67347cd106010989725d040a09c227c17e4c6b3c29373fb17700fd1
```

### UpgradeCap
```
0x5b9b62e1fd20de6131f0879b236518e9f5cf3c4f8b41b1f18924a77d80820524
```

---

## 🔗 Explorer Links

### View Package
```
https://suiexplorer.com/object/0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4?network=testnet
```

### View Transaction
```
https://suiexplorer.com/txblock/6n9y9a7sGxHU6iZEFZ5s1WCtZDXvjBeBdHtmED4ZE5T8?network=testnet
```

### View Treasury
```
https://suiexplorer.com/object/0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24?network=testnet
```

---

## 💰 Gas Cost

- **Storage Cost:** 38.281200 SUI
- **Computation Cost:** 1.000000 SUI
- **Storage Rebate:** 0.978120 SUI
- **Total Cost:** 38.303080 SUI

---

## 🎯 Backend Configuration

Add these to your `backend/.env.local`:

```env
# Sui Subscription Contract
SUI_SUBSCRIPTION_PACKAGE_ID=0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4
SUI_SUBSCRIPTION_TREASURY_ID=0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24
SUI_SUBSCRIPTION_PRICING_ID=0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274
SUI_SUBSCRIPTION_ADMIN_CAP_ID=0x6d08b64cc67347cd106010989725d040a09c227c17e4c6b3c29373fb17700fd1
SUI_NETWORK=testnet
```

---

## 📱 Frontend Integration

### TypeScript/JavaScript

```typescript
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const PACKAGE_ID = '0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4';
const TREASURY_ID = '0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24';
const PRICING_ID = '0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274';
const CLOCK_ID = '0x6'; // Sui Clock object

// Purchase Pro Monthly Subscription
async function purchaseSubscription(walletAddress: string) {
  const tx = new TransactionBlock();
  
  // Split coin for payment (10 SUI = 10,000,000,000 MIST)
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(10_000_000_000)]);
  
  // Call purchase function
  tx.moveCall({
    target: `${PACKAGE_ID}::premium_subscription::purchase_subscription`,
    arguments: [
      coin,
      tx.pure(1), // tier: 1 = Pro
      tx.pure(1), // duration: 1 = monthly
      tx.object(TREASURY_ID),
      tx.object(PRICING_ID),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
}

// Check subscription status
async function checkSubscription(nftId: string) {
  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });
  
  const nft = await client.getObject({
    id: nftId,
    options: { showContent: true }
  });
  
  const fields = nft.data?.content?.fields;
  const expiresAt = fields?.expires_at;
  const tier = fields?.tier;
  const isActive = expiresAt > Date.now() / 1000;
  
  return { tier, expiresAt, isActive };
}
```

---

## 🧪 Test Purchase (CLI)

```bash
# Get a coin with at least 10 SUI
sui client gas

# Purchase Pro monthly subscription
sui client call \
  --package 0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4 \
  --module premium_subscription \
  --function purchase_subscription \
  --args <YOUR_COIN_ID> 1 1 0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24 0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274 0x6 \
  --gas-budget 10000000
```

Parameters:
- `<YOUR_COIN_ID>`: A SUI coin object with at least 10 SUI
- `1`: Tier (1=Pro, 2=Team, 3=Enterprise)
- `1`: Duration (1=monthly, 12=yearly)
- Treasury ID
- Pricing ID
- `0x6`: Clock object (always 0x6)

---

## 🔐 Admin Functions

### Withdraw Funds

```bash
sui client call \
  --package 0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4 \
  --module premium_subscription \
  --function withdraw_funds \
  --args 0x6d08b64cc67347cd106010989725d040a09c227c17e4c6b3c29373fb17700fd1 0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24 <AMOUNT> 0x6 \
  --gas-budget 10000000
```

### Update Pricing

```bash
sui client call \
  --package 0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4 \
  --module premium_subscription \
  --function update_pricing \
  --args 0x6d08b64cc67347cd106010989725d040a09c227c17e4c6b3c29373fb17700fd1 0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274 <TIER> <DURATION> <NEW_PRICE> 0x6 \
  --gas-budget 10000000
```

---

## 📊 Current Pricing

| Tier | Monthly | Yearly |
|------|---------|--------|
| Pro (1) | 10 SUI | 100 SUI |
| Team (2) | 50 SUI | 500 SUI |
| Enterprise (3) | 200 SUI | 2000 SUI |

---

## 🎯 Next Steps

1. ✅ Contract deployed successfully
2. 📝 Add contract IDs to backend `.env.local`
3. 🔗 Update frontend with Package ID
4. 🧪 Test purchase from frontend
5. 📊 Monitor events on Sui Explorer
6. 💰 Test admin functions (withdraw, pricing updates)
7. 🚀 Deploy to mainnet when ready

---

## 📚 Documentation

- **Payment System Design:** `PREMIUM_PAYMENT_SYSTEM.md`
- **Contract Details:** `CONTRACT_COMPLETE.md`
- **Source Code:** `sources/premium_subscription.move`

---

## ⚠️ Important Notes

- **Keep AdminCap safe** - It controls pricing and fund withdrawal
- **Treasury is shared** - Anyone can view balance but only admin can withdraw
- **NFTs are transferable** - Users can sell/gift their subscriptions
- **No refunds** - Blockchain transactions are final
- **Test thoroughly** before mainnet deployment

---

**Deployed By:** 0xe97cdb302c6248f84d9c04b0e67277ebbd38191fe99084cc23d9f2cb61014e12  
**Network:** Sui Testnet  
**Status:** ✅ LIVE AND OPERATIONAL
