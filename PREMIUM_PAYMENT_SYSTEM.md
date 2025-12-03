# Premium Payment System - Smart Contract Design
**Sui Studio Subscription Management**

## Overview
Decentralized subscription payment system using Sui Move smart contracts for premium tier access.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Wallet  →  Smart Contract  →  Backend Verification    │
│      ↓               ↓                      ↓                │
│   Pay SUI      Mint NFT/Token         Update Database       │
│                Issue Receipt          Grant Premium Access   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Design

### Option 1: NFT-Based Subscription (RECOMMENDED)
**Concept:** Premium access = owning a subscription NFT

**Advantages:**
- ✅ Transferable (users can sell/gift subscriptions)
- ✅ Tradeable on marketplaces
- ✅ Visual representation (NFT artwork)
- ✅ Easy verification (check NFT ownership)
- ✅ Automatic expiry via metadata

**Contract Structure:**
```move
module sui_studio::premium_subscription {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::event;

    // Subscription NFT
    struct SubscriptionNFT has key, store {
        id: UID,
        tier: u8,              // 1=Pro, 2=Team, 3=Enterprise
        expires_at: u64,       // Unix timestamp
        user_address: address,
        issued_at: u64,
        auto_renew: bool,
    }

    // Treasury for collecting payments
    struct Treasury has key {
        id: UID,
        balance: Balance<SUI>,
        owner: address,
    }

    // Pricing configuration
    struct PricingConfig has key {
        id: UID,
        pro_monthly: u64,      // in MIST (1 SUI = 1B MIST)
        pro_yearly: u64,
        team_monthly: u64,
        team_yearly: u64,
        enterprise_monthly: u64,
        enterprise_yearly: u64,
    }

    // Events
    struct SubscriptionPurchased has copy, drop {
        nft_id: ID,
        buyer: address,
        tier: u8,
        duration_months: u8,
        amount_paid: u64,
        expires_at: u64,
    }

    struct SubscriptionRenewed has copy, drop {
        nft_id: ID,
        owner: address,
        new_expiry: u64,
    }

    struct SubscriptionCancelled has copy, drop {
        nft_id: ID,
        owner: address,
    }

    // Initialize contract
    fun init(ctx: &mut TxContext) {
        // Create treasury
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
            owner: tx_context::sender(ctx),
        };
        transfer::share_object(treasury);

        // Create pricing config
        let pricing = PricingConfig {
            id: object::new(ctx),
            pro_monthly: 10_000_000_000,      // 10 SUI/month
            pro_yearly: 100_000_000_000,      // 100 SUI/year (2 months free)
            team_monthly: 50_000_000_000,     // 50 SUI/month
            team_yearly: 500_000_000_000,     // 500 SUI/year
            enterprise_monthly: 200_000_000_000, // 200 SUI/month
            enterprise_yearly: 2_000_000_000_000, // 2000 SUI/year
        };
        transfer::share_object(pricing);
    }

    // Purchase subscription
    public entry fun purchase_subscription(
        payment: Coin<SUI>,
        tier: u8,
        duration_months: u8,
        treasury: &mut Treasury,
        pricing: &PricingConfig,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate tier and duration
        assert!(tier >= 1 && tier <= 3, 0); // Invalid tier
        assert!(duration_months == 1 || duration_months == 12, 1); // Only monthly or yearly

        // Calculate required payment
        let required_amount = get_price(pricing, tier, duration_months);
        let paid_amount = coin::value(&payment);
        assert!(paid_amount >= required_amount, 2); // Insufficient payment

        // Add payment to treasury
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut treasury.balance, payment_balance);

        // Calculate expiry
        let current_time = clock::timestamp_ms(clock) / 1000; // Convert to seconds
        let duration_seconds = (duration_months as u64) * 30 * 24 * 60 * 60;
        let expires_at = current_time + duration_seconds;

        // Mint subscription NFT
        let nft = SubscriptionNFT {
            id: object::new(ctx),
            tier,
            expires_at,
            user_address: tx_context::sender(ctx),
            issued_at: current_time,
            auto_renew: false,
        };

        let nft_id = object::id(&nft);

        // Emit event
        event::emit(SubscriptionPurchased {
            nft_id,
            buyer: tx_context::sender(ctx),
            tier,
            duration_months,
            amount_paid: paid_amount,
            expires_at,
        });

        // Transfer NFT to buyer
        transfer::transfer(nft, tx_context::sender(ctx));
    }

    // Renew subscription
    public entry fun renew_subscription(
        nft: &mut SubscriptionNFT,
        payment: Coin<SUI>,
        duration_months: u8,
        treasury: &mut Treasury,
        pricing: &PricingConfig,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify ownership
        assert!(nft.user_address == tx_context::sender(ctx), 3);

        // Calculate payment
        let required_amount = get_price(pricing, nft.tier, duration_months);
        let paid_amount = coin::value(&payment);
        assert!(paid_amount >= required_amount, 2);

        // Add payment to treasury
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut treasury.balance, payment_balance);

        // Extend expiry
        let current_time = clock::timestamp_ms(clock) / 1000;
        let duration_seconds = (duration_months as u64) * 30 * 24 * 60 * 60;
        
        // If expired, start from now; otherwise extend from current expiry
        if (nft.expires_at < current_time) {
            nft.expires_at = current_time + duration_seconds;
        } else {
            nft.expires_at = nft.expires_at + duration_seconds;
        };

        // Emit event
        event::emit(SubscriptionRenewed {
            nft_id: object::id(nft),
            owner: tx_context::sender(ctx),
            new_expiry: nft.expires_at,
        });
    }

    // Check if subscription is active
    public fun is_active(nft: &SubscriptionNFT, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock) / 1000;
        nft.expires_at > current_time
    }

    // Get subscription details
    public fun get_details(nft: &SubscriptionNFT): (u8, u64, address, u64, bool) {
        (nft.tier, nft.expires_at, nft.user_address, nft.issued_at, nft.auto_renew)
    }

    // Helper: Get price for tier and duration
    fun get_price(pricing: &PricingConfig, tier: u8, duration_months: u8): u64 {
        if (tier == 1) { // Pro
            if (duration_months == 1) { pricing.pro_monthly }
            else { pricing.pro_yearly }
        } else if (tier == 2) { // Team
            if (duration_months == 1) { pricing.team_monthly }
            else { pricing.team_yearly }
        } else { // Enterprise
            if (duration_months == 1) { pricing.enterprise_monthly }
            else { pricing.enterprise_yearly }
        }
    }

    // Admin: Withdraw funds
    public entry fun withdraw_funds(
        treasury: &mut Treasury,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == treasury.owner, 4); // Not authorized
        
        let withdrawn = coin::take(&mut treasury.balance, amount, ctx);
        transfer::public_transfer(withdrawn, treasury.owner);
    }

    // Admin: Update pricing
    public entry fun update_pricing(
        pricing: &mut PricingConfig,
        tier: u8,
        duration_months: u8,
        new_price: u64,
        treasury: &Treasury,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == treasury.owner, 4);
        
        if (tier == 1) {
            if (duration_months == 1) { pricing.pro_monthly = new_price }
            else { pricing.pro_yearly = new_price }
        } else if (tier == 2) {
            if (duration_months == 1) { pricing.team_monthly = new_price }
            else { pricing.team_yearly = new_price }
        } else {
            if (duration_months == 1) { pricing.enterprise_monthly = new_price }
            else { pricing.enterprise_yearly = new_price }
        }
    }
}
```

---

### Option 2: Token-Based Subscription
**Concept:** Premium access = holding subscription tokens

**Advantages:**
- ✅ Simpler implementation
- ✅ Fungible (can split/combine)
- ✅ Easy balance checking

**Use Case:** Better for usage-based billing (credits system)

---

## Pricing Structure

### Tier 1: Pro ($10/month in SUI)
- Price: 10 SUI/month or 100 SUI/year
- Features: All IDE features, AI assistant, unlimited projects

### Tier 2: Team ($50/month in SUI)
- Price: 50 SUI/month or 500 SUI/year
- Features: Pro + real-time collaboration, team management

### Tier 3: Enterprise ($200/month in SUI)
- Price: 200 SUI/month or 2000 SUI/year
- Features: Team + priority support, custom integrations, SLA

**Note:** Prices in SUI will fluctuate with market. Consider:
- USD-pegged stablecoin option (USDC on Sui)
- Dynamic pricing oracle integration

---

## Backend Integration

### Database Schema Updates

```prisma
model Subscription {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  // Blockchain data
  nftId         String   @unique  // Sui object ID
  nftAddress    String             // NFT contract address
  ownerAddress  String             // Wallet address
  
  // Subscription details
  tier          Int                // 1=Pro, 2=Team, 3=Enterprise
  status        String             // active, expired, cancelled
  expiresAt     DateTime
  issuedAt      DateTime
  autoRenew     Boolean   @default(false)
  
  // Payment tracking
  lastPayment   DateTime?
  paymentTxHash String?
  amountPaid    String?            // In MIST
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([userId])
  @@index([nftId])
  @@index([ownerAddress])
}

model PaymentHistory {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  subscriptionId  String?
  
  // Transaction details
  txHash          String   @unique
  amount          String             // In MIST
  currency        String   @default("SUI")
  tier            Int
  durationMonths  Int
  
  // Status
  status          String             // pending, confirmed, failed
  confirmedAt     DateTime?
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([txHash])
}
```

### Backend API Routes

```typescript
// backend/src/routes/subscription.ts

// 1. Get pricing
GET /api/subscription/pricing
Response: {
  pro: { monthly: "10000000000", yearly: "100000000000" },
  team: { monthly: "50000000000", yearly: "500000000000" },
  enterprise: { monthly: "200000000000", yearly: "2000000000000" }
}

// 2. Initiate purchase (prepare transaction)
POST /api/subscription/purchase/prepare
Body: { tier: 1, durationMonths: 1 }
Response: {
  contractAddress: "0x...",
  functionName: "purchase_subscription",
  arguments: [...],
  requiredAmount: "10000000000"
}

// 3. Verify purchase (after blockchain transaction)
POST /api/subscription/purchase/verify
Body: { 
  txHash: "0x...",
  nftId: "0x..."
}
Response: {
  success: true,
  subscription: { ... }
}

// 4. Check subscription status
GET /api/subscription/status
Response: {
  active: true,
  tier: 1,
  expiresAt: "2025-01-03T00:00:00Z",
  nftId: "0x...",
  daysRemaining: 30
}

// 5. Renew subscription
POST /api/subscription/renew
Body: { nftId: "0x...", durationMonths: 1 }

// 6. Cancel subscription
POST /api/subscription/cancel
Body: { nftId: "0x..." }

// 7. Get payment history
GET /api/subscription/history
Response: {
  payments: [
    {
      date: "2024-12-03",
      amount: "10 SUI",
      tier: "Pro",
      status: "confirmed"
    }
  ]
}
```

---

## Frontend Integration

### Payment Flow Component

```typescript
// src/components/subscription/SubscriptionPurchase.tsx

1. User selects tier and duration
2. Display price in SUI (with USD equivalent)
3. Connect wallet (if not connected)
4. Prepare transaction via backend
5. Sign transaction with wallet
6. Submit to Sui network
7. Wait for confirmation
8. Verify with backend
9. Update UI with premium access
```

### Subscription Status Component

```typescript
// src/components/subscription/SubscriptionStatus.tsx

- Display current tier
- Show expiry date
- Days remaining indicator
- Renew button
- Cancel button
- Payment history
- NFT details (view on explorer)
```

---

## Verification System

### On-Chain Verification
```typescript
// Frontend checks NFT ownership
const hasActiveSubscription = async (userAddress: string) => {
  // 1. Query user's NFTs
  const nfts = await suiClient.getOwnedObjects({
    owner: userAddress,
    filter: { StructType: "0x...::premium_subscription::SubscriptionNFT" }
  });
  
  // 2. Check each NFT for active status
  for (const nft of nfts) {
    const details = await suiClient.getObject({ id: nft.objectId });
    const expiresAt = details.data.content.fields.expires_at;
    
    if (expiresAt > Date.now() / 1000) {
      return { active: true, tier: details.data.content.fields.tier };
    }
  }
  
  return { active: false };
};
```

### Backend Verification
```typescript
// Verify on every API request
const verifyPremiumAccess = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: { 
      userId,
      status: 'active',
      expiresAt: { gt: new Date() }
    }
  });
  
  if (!subscription) return { premium: false };
  
  // Double-check on-chain (optional, for security)
  const onChainStatus = await checkNFTStatus(subscription.nftId);
  
  return { 
    premium: true, 
    tier: subscription.tier,
    features: getTierFeatures(subscription.tier)
  };
};
```

---

## Security Considerations

### 1. **Prevent Double-Spending**
- Verify transaction on-chain before granting access
- Check transaction status (success/failure)
- Validate NFT ownership

### 2. **Handle Expiry**
- Cron job to check expired subscriptions daily
- Grace period (3 days) before revoking access
- Email notifications before expiry

### 3. **Refund Policy**
- No refunds (blockchain transactions are final)
- Pro-rated credits for downgrades
- Clear terms in UI

### 4. **Price Oracle**
- Use Pyth Network or Switchboard for SUI/USD price
- Update prices dynamically
- Lock price at purchase time

---

## Alternative: Stablecoin Payments

For price stability, accept USDC instead of SUI:

```move
use sui::coin::{Coin};
use usdc::usdc::USDC; // Wormhole USDC on Sui

public entry fun purchase_with_usdc(
    payment: Coin<USDC>,
    tier: u8,
    duration_months: u8,
    // ... rest of parameters
) {
    // Same logic but with USDC
}
```

**Advantages:**
- ✅ Stable pricing ($10 = 10 USDC always)
- ✅ Easier accounting
- ✅ User-friendly (no price volatility)

---

## Implementation Roadmap

### Phase 1: Smart Contract (Week 1)
- [ ] Write Move contract
- [ ] Deploy to testnet
- [ ] Test all functions
- [ ] Audit contract

### Phase 2: Backend Integration (Week 2)
- [ ] Add database models
- [ ] Create API routes
- [ ] Implement verification
- [ ] Add webhook for events

### Phase 3: Frontend UI (Week 3)
- [ ] Subscription purchase flow
- [ ] Payment modal
- [ ] Status dashboard
- [ ] Admin panel

### Phase 4: Testing & Launch (Week 4)
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Deploy to mainnet
- [ ] Launch premium tiers

---

## Cost Analysis

### Gas Costs (Estimated)
- Purchase subscription: ~0.01 SUI
- Renew subscription: ~0.008 SUI
- Check status: Free (read-only)

### Revenue Model
- 10 SUI/month Pro = ~$30/month (at $3/SUI)
- 50 SUI/month Team = ~$150/month
- 200 SUI/month Enterprise = ~$600/month

### Break-even
- Need ~100 Pro users to cover infrastructure costs
- Team/Enterprise tiers are high-margin

---

## Conclusion

**Recommended Approach:**
1. **NFT-based subscriptions** for flexibility and tradability
2. **USDC payments** for price stability
3. **Hybrid verification** (on-chain + database) for security
4. **Auto-renewal** option for convenience

This system provides a fully decentralized, transparent, and secure payment infrastructure for Sui Studio premium tiers.
