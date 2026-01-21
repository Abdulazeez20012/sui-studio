#[test_only]
module subscription::subscription_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::test_utils;
    use subscription::premium_subscription::{Self, 
        SubscriptionNFT, 
        Treasury, 
        PricingConfig, 
        AdminCap
    };

    // Test addresses
    const ADMIN: address = @0xAD;
    const USER1: address = @0xA1;
    const USER2: address = @0xA2;

    // Test constants
    const TIER_PRO: u8 = 1;
    const TIER_TEAM: u8 = 2;
    const TIER_ENTERPRISE: u8 = 3;
    const DURATION_MONTHLY: u8 = 1;
    const DURATION_YEARLY: u8 = 12;

    // Pricing constants (in MIST)
    const PRO_MONTHLY: u64 = 10_000_000_000;
    const PRO_YEARLY: u64 = 100_000_000_000;
    const TEAM_MONTHLY: u64 = 50_000_000_000;
    const TEAM_YEARLY: u64 = 500_000_000_000;
    const ENTERPRISE_MONTHLY: u64 = 200_000_000_000;
    const ENTERPRISE_YEARLY: u64 = 2_000_000_000_000;

    // ======== Helper Functions ========

    fun setup_test(): Scenario {
        let mut scenario = ts::begin(ADMIN);
        {
            premium_subscription::init_for_testing(ts::ctx(&mut scenario));
        };
        scenario
    }

    fun create_clock(scenario: &mut Scenario): Clock {
        clock::create_for_testing(ts::ctx(scenario))
    }

    fun advance_clock(clock: &mut Clock, seconds: u64) {
        clock::increment_for_testing(clock, seconds * 1000); // Convert to milliseconds
    }

    // ======== Initialization Tests ========

    #[test]
    fun test_init_creates_objects() {
        let mut scenario = setup_test();
        
        // Check AdminCap was created and sent to admin
        ts::next_tx(&mut scenario, ADMIN);
        {
            assert!(ts::has_most_recent_for_sender<AdminCap>(&scenario), 0);
        };

        // Check Treasury was created as shared object
        ts::next_tx(&mut scenario, ADMIN);
        {
            let treasury = ts::take_shared<Treasury>(&scenario);
            let (balance, revenue, subs) = premium_subscription::get_treasury_stats(&treasury);
            assert!(balance == 0, 1);
            assert!(revenue == 0, 2);
            assert!(subs == 0, 3);
            ts::return_shared(treasury);
        };

        // Check PricingConfig was created
        ts::next_tx(&mut scenario, ADMIN);
        {
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            let (pro_m, pro_y, team_m, team_y, ent_m, ent_y) = premium_subscription::get_all_pricing(&pricing);
            assert!(pro_m == PRO_MONTHLY, 4);
            assert!(pro_y == PRO_YEARLY, 5);
            assert!(team_m == TEAM_MONTHLY, 6);
            assert!(team_y == TEAM_YEARLY, 7);
            assert!(ent_m == ENTERPRISE_MONTHLY, 8);
            assert!(ent_y == ENTERPRISE_YEARLY, 9);
            ts::return_shared(pricing);
        };

        ts::end(scenario);
    }

    // ======== Purchase Tests ========

    #[test]
    fun test_purchase_pro_monthly() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            // Create payment
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            
            // Purchase subscription
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Verify NFT was created
        ts::next_tx(&mut scenario, USER1);
        {
            assert!(ts::has_most_recent_for_sender<SubscriptionNFT>(&scenario), 0);
            
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let (tier, expires_at, user_addr, issued_at, auto_renew) = premium_subscription::get_details(&nft);
            
            assert!(tier == TIER_PRO, 1);
            assert!(user_addr == USER1, 2);
            assert!(!auto_renew, 3);
            assert!(premium_subscription::is_active(&nft, &clock), 4);
            
            ts::return_to_sender(&scenario, nft);
        };

        // Verify treasury received payment
        ts::next_tx(&mut scenario, USER1);
        {
            let treasury = ts::take_shared<Treasury>(&scenario);
            let (balance, revenue, subs) = premium_subscription::get_treasury_stats(&treasury);
            assert!(balance == PRO_MONTHLY, 5);
            assert!(revenue == PRO_MONTHLY, 6);
            assert!(subs == 1, 7);
            ts::return_shared(treasury);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_purchase_team_yearly() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(TEAM_YEARLY, ts::ctx(&mut scenario));
            
            premium_subscription::purchase_subscription(
                payment,
                TIER_TEAM,
                DURATION_YEARLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        ts::next_tx(&mut scenario, USER1);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let tier = premium_subscription::get_tier(&nft);
            assert!(tier == TIER_TEAM, 0);
            ts::return_to_sender(&scenario, nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_purchase_enterprise_monthly() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, USER2);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(ENTERPRISE_MONTHLY, ts::ctx(&mut scenario));
            
            premium_subscription::purchase_subscription(
                payment,
                TIER_ENTERPRISE,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        ts::next_tx(&mut scenario, USER2);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            assert!(premium_subscription::get_tier(&nft) == TIER_ENTERPRISE, 0);
            ts::return_to_sender(&scenario, nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = premium_subscription::EInsufficientPayment)]
    fun test_purchase_insufficient_payment() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            // Try to pay less than required
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY - 1, ts::ctx(&mut scenario));
            
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = premium_subscription::EInvalidTier)]
    fun test_purchase_invalid_tier() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            
            // Try invalid tier (4)
            premium_subscription::purchase_subscription(
                payment,
                4,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = premium_subscription::EInvalidDuration)]
    fun test_purchase_invalid_duration() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            
            // Try invalid duration (6 months)
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                6,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ======== Renewal Tests ========

    #[test]
    fun test_renew_before_expiry() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // Purchase initial subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Get initial expiry
        let initial_expiry: u64;
        ts::next_tx(&mut scenario, USER1);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            initial_expiry = premium_subscription::get_expiry(&nft);
            ts::return_to_sender(&scenario, nft);
        };

        // Advance time by 15 days (half a month)
        advance_clock(&mut clock, 15 * 86400);

        // Renew subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::renew_subscription(
                &mut nft,
                payment,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            // Verify expiry was extended from original expiry
            let new_expiry = premium_subscription::get_expiry(&nft);
            assert!(new_expiry > initial_expiry, 0);

            ts::return_to_sender(&scenario, nft);
            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_renew_after_expiry() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // Purchase initial subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Advance time by 31 days (past expiry)
        advance_clock(&mut clock, 31 * 86400);

        // Verify subscription is expired
        ts::next_tx(&mut scenario, USER1);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            assert!(!premium_subscription::is_active(&nft, &clock), 0);
            ts::return_to_sender(&scenario, nft);
        };

        // Renew expired subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::renew_subscription(
                &mut nft,
                payment,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            // Verify subscription is now active
            assert!(premium_subscription::is_active(&nft, &clock), 1);

            ts::return_to_sender(&scenario, nft);
            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = premium_subscription::ENotOwner)]
    fun test_renew_not_owner() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // USER1 purchases subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // USER2 tries to renew USER1's subscription
        ts::next_tx(&mut scenario, USER2);
        {
            let mut nft = ts::take_from_address<SubscriptionNFT>(&scenario, USER1);
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::renew_subscription(
                &mut nft,
                payment,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_to_address(USER1, nft);
            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ======== Auto-Renew Tests ========

    #[test]
    fun test_set_auto_renew() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // Purchase subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Enable auto-renew
        ts::next_tx(&mut scenario, USER1);
        {
            let mut nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let (_, _, _, _, auto_renew) = premium_subscription::get_details(&nft);
            assert!(!auto_renew, 0);

            premium_subscription::set_auto_renew(&mut nft, true, ts::ctx(&mut scenario));
            
            let (_, _, _, _, auto_renew_after) = premium_subscription::get_details(&nft);
            assert!(auto_renew_after, 1);

            ts::return_to_sender(&scenario, nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ======== Cancellation Tests ========

    #[test]
    fun test_cancel_subscription() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // Purchase subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Cancel subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            premium_subscription::cancel_subscription(nft, &clock, ts::ctx(&mut scenario));
        };

        // Verify NFT no longer exists
        ts::next_tx(&mut scenario, USER1);
        {
            assert!(!ts::has_most_recent_for_sender<SubscriptionNFT>(&scenario), 0);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ======== Admin Tests ========

    #[test]
    fun test_withdraw_funds() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // USER1 purchases subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Admin withdraws funds
        ts::next_tx(&mut scenario, ADMIN);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            
            let balance_before = premium_subscription::get_treasury_balance(&treasury);
            assert!(balance_before == PRO_MONTHLY, 0);

            premium_subscription::withdraw_funds(
                &admin_cap,
                &mut treasury,
                PRO_MONTHLY / 2,
                &clock,
                ts::ctx(&mut scenario)
            );

            let balance_after = premium_subscription::get_treasury_balance(&treasury);
            assert!(balance_after == PRO_MONTHLY / 2, 1);

            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(treasury);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_update_pricing() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let old_price = premium_subscription::get_price(&pricing, TIER_PRO, DURATION_MONTHLY);
            assert!(old_price == PRO_MONTHLY, 0);

            let new_price = 15_000_000_000; // 15 SUI
            premium_subscription::update_pricing(
                &admin_cap,
                &mut pricing,
                TIER_PRO,
                DURATION_MONTHLY,
                new_price,
                &clock
            );

            let updated_price = premium_subscription::get_price(&pricing, TIER_PRO, DURATION_MONTHLY);
            assert!(updated_price == new_price, 1);

            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(pricing);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_transfer_admin() {
        let mut scenario = setup_test();
        
        // Admin transfers capability to USER1
        ts::next_tx(&mut scenario, ADMIN);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            premium_subscription::transfer_admin(admin_cap, USER1);
        };

        // Verify USER1 now has admin capability
        ts::next_tx(&mut scenario, USER1);
        {
            assert!(ts::has_most_recent_for_sender<AdminCap>(&scenario), 0);
        };

        ts::end(scenario);
    }

    // ======== View Function Tests ========

    #[test]
    fun test_get_days_remaining() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // Purchase subscription
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Check days remaining
        ts::next_tx(&mut scenario, USER1);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let days = premium_subscription::get_days_remaining(&nft, &clock);
            assert!(days == 30, 0); // Should be 30 days for monthly subscription
            ts::return_to_sender(&scenario, nft);
        };

        // Advance 15 days
        advance_clock(&mut clock, 15 * 86400);

        ts::next_tx(&mut scenario, USER1);
        {
            let nft = ts::take_from_sender<SubscriptionNFT>(&scenario);
            let days = premium_subscription::get_days_remaining(&nft, &clock);
            assert!(days == 15, 1); // Should be 15 days remaining
            ts::return_to_sender(&scenario, nft);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_multiple_subscriptions() {
        let mut scenario = setup_test();
        let mut clock = create_clock(&mut scenario);
        
        // USER1 purchases Pro
        ts::next_tx(&mut scenario, USER1);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(PRO_MONTHLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_PRO,
                DURATION_MONTHLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // USER2 purchases Team
        ts::next_tx(&mut scenario, USER2);
        {
            let mut treasury = ts::take_shared<Treasury>(&scenario);
            let pricing = ts::take_shared<PricingConfig>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(TEAM_YEARLY, ts::ctx(&mut scenario));
            premium_subscription::purchase_subscription(
                payment,
                TIER_TEAM,
                DURATION_YEARLY,
                &mut treasury,
                &pricing,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(treasury);
            ts::return_shared(pricing);
        };

        // Verify treasury stats
        ts::next_tx(&mut scenario, ADMIN);
        {
            let treasury = ts::take_shared<Treasury>(&scenario);
            let (balance, revenue, subs) = premium_subscription::get_treasury_stats(&treasury);
            assert!(balance == PRO_MONTHLY + TEAM_YEARLY, 0);
            assert!(revenue == PRO_MONTHLY + TEAM_YEARLY, 1);
            assert!(subs == 2, 2);
            ts::return_shared(treasury);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
