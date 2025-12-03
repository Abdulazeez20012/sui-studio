# Quick Start Guide - Subscription Smart Contract

## ✅ Fixed the Build Issue

The Move.toml has been updated to use `rev = "mainnet"` instead of `rev = "framework/testnet"` which was causing the Git dependency error.

## 🚀 Build the Contract

```bash
cd contracts/subscribtions
sui move build
```

Expected output:
```
BUILDING subscribtions
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
Build Successful
```

## 🧪 Run Tests

```bash
sui move test
```

Expected output:
```
Running Move unit tests
[ PASS    ] subscribtions::subscription_tests::test_init_creates_objects
[ PASS    ] subscribtions::subscription_tests::test_purchase_pro_monthly
[ PASS    ] subscribtions::subscription_tests::test_purchase_team_yearly
...
Test result: OK. Total tests: 17; passed: 17; failed: 0
```

## 📦 Deploy to Testnet

1. **Switch to testnet:**
```bash
sui client switch --env testnet
```

2. **Check your address has SUI:**
```bash
sui client gas
```

3. **Publish the contract:**
```bash
sui client publish --gas-budget 100000000
```

4. **Save the output:**
- Package ID
- Treasury ID (shared object)
- PricingConfig ID (shared object)
- AdminCap ID (your object)

## 🔍 Verify Deployment

Visit Sui Explorer:
```
https://suiexplorer.com/object/YOUR_PACKAGE_ID?network=testnet
```

## 📝 Test Purchase (CLI)

```bash
# Get a coin to pay with
sui client gas

# Purchase Pro monthly subscription
sui client call \
  --package YOUR_PACKAGE_ID \
  --module premium_subscription \
  --function purchase_subscription \
  --args YOUR_COIN_ID 1 1 TREASURY_ID PRICING_ID 0x6 \
  --gas-budget 10000000
```

Parameters:
- `YOUR_COIN_ID`: A SUI coin with at least 10 SUI
- `1`: Tier (1=Pro, 2=Team, 3=Enterprise)
- `1`: Duration (1=monthly, 12=yearly)
- `TREASURY_ID`: The shared Treasury object
- `PRICING_ID`: The shared PricingConfig object
- `0x6`: Clock object (always 0x6 on Sui)

## 🎯 Next Steps

1. ✅ Contract is built and tested
2. ✅ Deploy to testnet
3. 📱 Integrate with frontend
4. 🔗 Connect to backend API
5. 🚀 Deploy to mainnet

## 📚 Documentation

- Full contract docs: `contracts/subscription/README.md`
- Payment system design: `PREMIUM_PAYMENT_SYSTEM.md`
- Backend integration: See backend routes in design doc

## 🐛 Troubleshooting

### Build fails with Git error
- ✅ Fixed! Updated Move.toml to use `mainnet` branch

### Test fails
- Make sure you're in the `contracts/subscribtions` directory
- Run `sui move build` first

### Publish fails
- Check you have enough SUI for gas
- Increase gas budget if needed

## 💡 Tips

- Use testnet for development
- Test all functions before mainnet deployment
- Keep your AdminCap safe - it controls pricing and withdrawals
- Monitor events for all subscription activities

---

**Ready to deploy?** Run `sui move build` and `sui move test` now!
