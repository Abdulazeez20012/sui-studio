
/// Premium Subscription System for Sui Studio

/// NFT-based subscription management with tiered pricing

module subscribtions::premium_subscription {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::clock::{Self, Clock};
    use sui::event;

    
    const TIER_PRO: u8 = 1;
    const TIER_TEAM: u8 = 2;
    const TIER_ENTERPRISE: u8 = 3;
    
    const DURATION_MONTHLY: u8 = 1;
    const DURATION_YEARLY: u8 = 12;
    
    const SECONDS_PER_MONTH: u64 = 2592000; // 30 days

 
    
    const EInvalidTier: u64 = 0;
    const EInvalidDuration: u64 = 1;
    const EInsufficientPayment: u64 = 2;
    const ENotOwner: u64 = 3;
    const ENotAuthorized: u64 = 4;



    public struct AdminCap has key, store {
        id: UID,
    }

    /// Subscription NFT representing premium access

    public struct SubscriptionNFT has key, store {
        id: UID,
        tier: u8,
        expires_at: u64,
        user_address: address,
        issued_at: u64,
        auto_renew: bool,
    }


    public struct Treasury has key {
        id: UID,
        balance: Balance<SUI>,
        owner: address,
        total_revenue: u64,
        total_subscriptions: u64,
    }


    public struct PricingConfig has key {
        id: UID,
        pro_monthly: u64,
        pro_yearly: u64,
        team_monthly: u64,
        team_yearly: u64,
        enterprise_monthly: u64,
        enterprise_yearly: u64,
    }


    public struct SubscriptionPurchased has copy, drop {
        nft_id: ID,
        buyer: address,
        tier: u8,
        duration_months: u8,
        amount_paid: u64,
        expires_at: u64,
        timestamp: u64,
    }

    public struct SubscriptionRenewed has copy, drop {
        nft_id: ID,
        owner: address,
        tier: u8,
        new_expiry: u64,
        amount_paid: u64,
        timestamp: u64,
    }

    public struct SubscriptionCancelled has copy, drop {
        nft_id: ID,
        owner: address,
        tier: u8,
        timestamp: u64,
    }

    public struct PricingUpdated has copy, drop {
        tier: u8,
        duration_months: u8,
        old_price: u64,
        new_price: u64,
        timestamp: u64,
    }

    public struct FundsWithdrawn has copy, drop {
        amount: u64,
        recipient: address,
        timestamp: u64,
    }


    fun init(ctx: &mut TxContext) {
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // Create treasury
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
            owner: tx_context::sender(ctx),
            total_revenue: 0,
            total_subscriptions: 0,
        };
        transfer::share_object(treasury);

        let pricing = PricingConfig {
            id: object::new(ctx),
            pro_monthly: 10_000_000_000,        // 10 SUI/month
            pro_yearly: 100_000_000_000,        // 100 SUI/year (2 months free)
            team_monthly: 50_000_000_000,       // 50 SUI/month
            team_yearly: 500_000_000_000,       // 500 SUI/year
            enterprise_monthly: 200_000_000_000, // 200 SUI/month
            enterprise_yearly: 2_000_000_000_000, // 2000 SUI/year
        };
        transfer::share_object(pricing);
    }


    /// Purchase a new subscription

    public entry fun purchase_subscription(
        payment: Coin<SUI>,
        tier: u8,
        duration_months: u8,
        treasury: &mut Treasury,
        pricing: &PricingConfig,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate inputs

        assert!(tier >= TIER_PRO && tier <= TIER_ENTERPRISE, EInvalidTier);
        assert!(duration_months == DURATION_MONTHLY || duration_months == DURATION_YEARLY, EInvalidDuration);

        // Calculate required payment

        let required_amount = get_price(pricing, tier, duration_months);
        let paid_amount = coin::value(&payment);
        assert!(paid_amount >= required_amount, EInsufficientPayment);

        // Add payment to treasury

        let payment_balance = coin::into_balance(payment);
        balance::join(&mut treasury.balance, payment_balance);
        treasury.total_revenue = treasury.total_revenue + paid_amount;
        treasury.total_subscriptions = treasury.total_subscriptions + 1;

        // Calculate expiry timestamp

        let current_time = clock::timestamp_ms(clock) / 1000;
        let duration_seconds = (duration_months as u64) * SECONDS_PER_MONTH;
        let expires_at = current_time + duration_seconds;

        // Create subscription NFT

        let nft = SubscriptionNFT {
            id: object::new(ctx),
            tier,
            expires_at,
            user_address: tx_context::sender(ctx),
            issued_at: current_time,
            auto_renew: false,
        };

        let nft_id = object::id(&nft);

        // Emit purchase event

        event::emit(SubscriptionPurchased {
            nft_id,
            buyer: tx_context::sender(ctx),
            tier,
            duration_months,
            amount_paid: paid_amount,
            expires_at,
            timestamp: current_time,
        });

        // Transfer NFT to buyer

        transfer::transfer(nft, tx_context::sender(ctx));
    }

    /// Renew an existing subscription

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

        assert!(nft.user_address == tx_context::sender(ctx), ENotOwner);
        assert!(duration_months == DURATION_MONTHLY || duration_months == DURATION_YEARLY, EInvalidDuration);

        // Calculate payment

        let required_amount = get_price(pricing, nft.tier, duration_months);
        let paid_amount = coin::value(&payment);
        assert!(paid_amount >= required_amount, EInsufficientPayment);

        // Add payment to treasury

        let payment_balance = coin::into_balance(payment);
        balance::join(&mut treasury.balance, payment_balance);
        treasury.total_revenue = treasury.total_revenue + paid_amount;

        // Extend expiry

        let current_time = clock::timestamp_ms(clock) / 1000;
        let duration_seconds = (duration_months as u64) * SECONDS_PER_MONTH;
        
        // If expired, start from now; otherwise extend from current expiry
        if (nft.expires_at < current_time) {
            nft.expires_at = current_time + duration_seconds;
        } else {
            nft.expires_at = nft.expires_at + duration_seconds;
        };

        // Emit renewal event

        event::emit(SubscriptionRenewed {
            nft_id: object::id(nft),
            owner: tx_context::sender(ctx),
            tier: nft.tier,
            new_expiry: nft.expires_at,
            amount_paid: paid_amount,
            timestamp: current_time,
        });
    }

    /// Toggle auto-renewal setting

    public entry fun set_auto_renew(
        nft: &mut SubscriptionNFT,
        auto_renew: bool,
        ctx: &mut TxContext
    ) {
        assert!(nft.user_address == tx_context::sender(ctx), ENotOwner);
        nft.auto_renew = auto_renew;
    }

    /// Cancel subscription (burns NFT)

    public entry fun cancel_subscription(
        nft: SubscriptionNFT,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(nft.user_address == tx_context::sender(ctx), ENotOwner);
        
        let current_time = clock::timestamp_ms(clock) / 1000;
        let nft_id = object::id(&nft);
        let tier = nft.tier;
        
        // Emit cancellation event
        event::emit(SubscriptionCancelled {
            nft_id,
            owner: tx_context::sender(ctx),
            tier,
            timestamp: current_time,
        });

        // Destroy the NFT
        
        let SubscriptionNFT { id, tier: _, expires_at: _, user_address: _, issued_at: _, auto_renew: _ } = nft;
        object::delete(id);
    }


    /// Withdraw funds from treasury (admin only)
    public entry fun withdraw_funds(
        _: &AdminCap,
        treasury: &mut Treasury,
        amount: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let withdrawn = coin::take(&mut treasury.balance, amount, ctx);
        let recipient = treasury.owner;
        
        event::emit(FundsWithdrawn {
            amount,
            recipient,
            timestamp: clock::timestamp_ms(clock) / 1000,
        });
        
        transfer::public_transfer(withdrawn, recipient);
    }

    /// Update pricing for a specific tier and duration (admin only)
    public entry fun update_pricing(
        _: &AdminCap,
        pricing: &mut PricingConfig,
        tier: u8,
        duration_months: u8,
        new_price: u64,
        clock: &Clock,
    ) {
        assert!(tier >= TIER_PRO && tier <= TIER_ENTERPRISE, EInvalidTier);
        assert!(duration_months == DURATION_MONTHLY || duration_months == DURATION_YEARLY, EInvalidDuration);
        
        let old_price = get_price(pricing, tier, duration_months);
        
        if (tier == TIER_PRO) {
            if (duration_months == DURATION_MONTHLY) {
                pricing.pro_monthly = new_price;
            } else {
                pricing.pro_yearly = new_price;
            }
        } else if (tier == TIER_TEAM) {
            if (duration_months == DURATION_MONTHLY) {
                pricing.team_monthly = new_price;
            } else {
                pricing.team_yearly = new_price;
            }
        } else {
            if (duration_months == DURATION_MONTHLY) {
                pricing.enterprise_monthly = new_price;
            } else {
                pricing.enterprise_yearly = new_price;
            }
        };

        event::emit(PricingUpdated {
            tier,
            duration_months,
            old_price,
            new_price,
            timestamp: clock::timestamp_ms(clock) / 1000,
        });
    }

    /// Transfer admin capability
    public entry fun transfer_admin(
        admin_cap: AdminCap,
        new_admin: address,
    ) {
        transfer::transfer(admin_cap, new_admin);
    }


    /// Check if subscription is currently active
    public fun is_active(nft: &SubscriptionNFT, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock) / 1000;
        nft.expires_at > current_time
    }

    /// Get subscription details
    public fun get_details(nft: &SubscriptionNFT): (u8, u64, address, u64, bool) {
        (nft.tier, nft.expires_at, nft.user_address, nft.issued_at, nft.auto_renew)
    }

    /// Get tier from NFT
    public fun get_tier(nft: &SubscriptionNFT): u8 {
        nft.tier
    }

    /// Get expiry timestamp
    public fun get_expiry(nft: &SubscriptionNFT): u64 {
        nft.expires_at
    }

    /// Get days remaining until expiry
    public fun get_days_remaining(nft: &SubscriptionNFT, clock: &Clock): u64 {
        let current_time = clock::timestamp_ms(clock) / 1000;
        if (nft.expires_at <= current_time) {
            0
        } else {
            (nft.expires_at - current_time) / 86400 // Convert seconds to days
        }
    }

    /// Get treasury balance
    public fun get_treasury_balance(treasury: &Treasury): u64 {
        balance::value(&treasury.balance)
    }

    /// Get treasury statistics
    public fun get_treasury_stats(treasury: &Treasury): (u64, u64, u64) {
        (
            balance::value(&treasury.balance),
            treasury.total_revenue,
            treasury.total_subscriptions
        )
    }

    /// Get price for specific tier and duration
    public fun get_price(pricing: &PricingConfig, tier: u8, duration_months: u8): u64 {
        if (tier == TIER_PRO) {
            if (duration_months == DURATION_MONTHLY) { pricing.pro_monthly }
            else { pricing.pro_yearly }
        } else if (tier == TIER_TEAM) {
            if (duration_months == DURATION_MONTHLY) { pricing.team_monthly }
            else { pricing.team_yearly }
        } else {
            if (duration_months == DURATION_MONTHLY) { pricing.enterprise_monthly }
            else { pricing.enterprise_yearly }
        }
    }

    /// Get all pricing information
    public fun get_all_pricing(pricing: &PricingConfig): (u64, u64, u64, u64, u64, u64) {
        (
            pricing.pro_monthly,
            pricing.pro_yearly,
            pricing.team_monthly,
            pricing.team_yearly,
            pricing.enterprise_monthly,
            pricing.enterprise_yearly
        )
    }


    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
