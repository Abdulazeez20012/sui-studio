import { FileNode } from '../types/ide';

export interface Template {
  name: string;
  description: string;
  category: 'starter' | 'nft' | 'defi' | 'gaming' | 'token';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  files: FileNode[];
}

export const templates: Record<string, Template> = {
  helloWorld: {
    name: 'Hello World',
    description: 'A simple Sui Move project to get started',
    category: 'starter',
    difficulty: 'beginner',
    features: ['Basic module structure', 'Entry functions', 'String handling'],
    files: [
      {
        id: '1',
        name: 'sources',
        type: 'folder' as const,
        path: '/sources',
        children: [
          {
            id: '2',
            name: 'hello_world.move',
            type: 'file' as const,
            path: '/sources/hello_world.move',
            language: 'rust',
            content: `module hello_world::hello {
    use std::string::{Self, String};
    use sui::event;
    
    /// Event emitted when hello is called
    struct HelloEvent has copy, drop {
        message: String,
    }
    
    /// Say hello and emit an event
    public entry fun say_hello() {
        let message = string::utf8(b"Hello, Sui!");
        event::emit(HelloEvent { message });
    }
    
    /// Say hello to a specific person
    public entry fun say_hello_to(name: vector<u8>) {
        let greeting = string::utf8(b"Hello, ");
        string::append(&mut greeting, string::utf8(name));
        string::append_utf8(&mut greeting, b"!");
        event::emit(HelloEvent { message: greeting });
    }
    
    #[test]
    fun test_say_hello() {
        say_hello();
    }
}`
          }
        ]
      },
      {
        id: '3',
        name: 'tests',
        type: 'folder' as const,
        path: '/tests',
        children: [
          {
            id: '4',
            name: 'hello_world_tests.move',
            type: 'file' as const,
            path: '/tests/hello_world_tests.move',
            language: 'rust',
            content: `#[test_only]
module hello_world::hello_tests {
    use hello_world::hello;
    
    #[test]
    fun test_say_hello() {
        hello::say_hello();
    }
    
    #[test]
    fun test_say_hello_to() {
        hello::say_hello_to(b"Alice");
    }
}`
          }
        ]
      },
      {
        id: '5',
        name: 'Move.toml',
        type: 'file' as const,
        path: '/Move.toml',
        language: 'toml',
        content: `[package]
name = "HelloWorld"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
hello_world = "0x0"
`
      },
      {
        id: '6',
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        language: 'markdown',
        content: `# Hello World Sui Project

A simple Sui Move project to get started with Sui development.

## Features
- Basic module structure
- Entry functions
- Event emission
- Unit tests

## Build
\`\`\`bash
sui move build
\`\`\`

## Test
\`\`\`bash
sui move test
\`\`\`

## Deploy
\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`
`
      }
    ] as FileNode[]
  },
  
  nft: {
    name: 'NFT Collection',
    description: 'Complete NFT collection with minting, transfers, and marketplace',
    category: 'nft',
    difficulty: 'intermediate',
    features: ['NFT minting', 'Metadata management', 'Royalties', 'Collection management'],
    files: [
      {
        id: '1',
        name: 'sources',
        type: 'folder' as const,
        path: '/sources',
        children: [
          {
            id: '2',
            name: 'nft.move',
            type: 'file' as const,
            path: '/sources/nft.move',
            language: 'rust',
            content: `module nft::collection {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use sui::event;
    use sui::display;
    use sui::package;
    
    /// NFT struct with metadata
    struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        creator: address,
        collection_id: u64,
    }
    
    /// Collection management
    struct Collection has key {
        id: UID,
        name: String,
        description: String,
        creator: address,
        total_supply: u64,
        max_supply: u64,
        royalty_percentage: u64,
    }
    
    /// Events
    struct NFTMinted has copy, drop {
        nft_id: address,
        creator: address,
        name: String,
    }
    
    struct NFTTransferred has copy, drop {
        nft_id: address,
        from: address,
        to: address,
    }
    
    /// Create a new collection
    public entry fun create_collection(
        name: vector<u8>,
        description: vector<u8>,
        max_supply: u64,
        royalty_percentage: u64,
        ctx: &mut TxContext
    ) {
        let collection = Collection {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            creator: tx_context::sender(ctx),
            total_supply: 0,
            max_supply,
            royalty_percentage,
        };
        
        transfer::share_object(collection);
    }
    
    /// Mint a new NFT
    public entry fun mint(
        collection: &mut Collection,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(collection.total_supply < collection.max_supply, 0);
        
        let sender = tx_context::sender(ctx);
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            creator: sender,
            collection_id: collection.total_supply,
        };
        
        collection.total_supply = collection.total_supply + 1;
        
        event::emit(NFTMinted {
            nft_id: object::uid_to_address(&nft.id),
            creator: sender,
            name: string::utf8(name),
        });
        
        transfer::public_transfer(nft, sender);
    }
    
    /// Transfer NFT to another address
    public entry fun transfer_nft(
        nft: NFT,
        recipient: address,
        ctx: &mut TxContext
    ) {
        event::emit(NFTTransferred {
            nft_id: object::uid_to_address(&nft.id),
            from: tx_context::sender(ctx),
            to: recipient,
        });
        
        transfer::public_transfer(nft, recipient);
    }
    
    /// Burn an NFT
    public entry fun burn(nft: NFT) {
        let NFT { id, name: _, description: _, url: _, creator: _, collection_id: _ } = nft;
        object::delete(id);
    }
    
    // Getters
    public fun get_nft_name(nft: &NFT): String {
        nft.name
    }
    
    public fun get_nft_description(nft: &NFT): String {
        nft.description
    }
    
    public fun get_nft_url(nft: &NFT): Url {
        nft.url
    }
}`
          }
        ]
      },
      {
        id: '3',
        name: 'tests',
        type: 'folder' as const,
        path: '/tests',
        children: [
          {
            id: '4',
            name: 'nft_tests.move',
            type: 'file' as const,
            path: '/tests/nft_tests.move',
            language: 'rust',
            content: `#[test_only]
module nft::collection_tests {
    use nft::collection;
    use sui::test_scenario;
    
    #[test]
    fun test_create_collection() {
        let admin = @0xAD;
        let scenario_val = test_scenario::begin(admin);
        let scenario = &mut scenario_val;
        
        {
            collection::create_collection(
                b"Test Collection",
                b"A test NFT collection",
                1000,
                5,
                test_scenario::ctx(scenario)
            );
        };
        
        test_scenario::end(scenario_val);
    }
    
    #[test]
    fun test_mint_nft() {
        let admin = @0xAD;
        let scenario_val = test_scenario::begin(admin);
        let scenario = &mut scenario_val;
        
        // Create collection
        {
            collection::create_collection(
                b"Test Collection",
                b"A test NFT collection",
                1000,
                5,
                test_scenario::ctx(scenario)
            );
        };
        
        test_scenario::next_tx(scenario, admin);
        
        // Mint NFT
        {
            let collection = test_scenario::take_shared<collection::Collection>(scenario);
            collection::mint(
                &mut collection,
                b"Test NFT",
                b"A test NFT",
                b"https://example.com/nft.png",
                test_scenario::ctx(scenario)
            );
            test_scenario::return_shared(collection);
        };
        
        test_scenario::end(scenario_val);
    }
}`
          }
        ]
      },
      {
        id: '5',
        name: 'Move.toml',
        type: 'file' as const,
        path: '/Move.toml',
        language: 'toml',
        content: `[package]
name = "NFTCollection"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
nft = "0x0"
`
      },
      {
        id: '6',
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        language: 'markdown',
        content: `# NFT Collection

A complete NFT collection implementation on Sui with minting, transfers, and royalties.

## Features
- Collection management with max supply
- NFT minting with metadata
- Transfer and burn functionality
- Royalty system
- Event emission
- Comprehensive tests

## Build
\`\`\`bash
sui move build
\`\`\`

## Test
\`\`\`bash
sui move test
\`\`\`

## Usage

### Create Collection
\`\`\`bash
sui client call --function create_collection --module collection --package <PACKAGE_ID> \\
  --args "My Collection" "Description" 1000 5
\`\`\`

### Mint NFT
\`\`\`bash
sui client call --function mint --module collection --package <PACKAGE_ID> \\
  --args <COLLECTION_ID> "NFT Name" "Description" "https://example.com/nft.png"
\`\`\`
`
      }
    ] as FileNode[]
  },
  
  defi: {
    name: 'DeFi AMM Pool',
    description: 'Automated Market Maker with liquidity pools and swaps',
    category: 'defi',
    difficulty: 'advanced',
    features: ['Liquidity pools', 'Token swaps', 'LP tokens', 'Fee collection'],
    files: [
      {
        id: '1',
        name: 'sources',
        type: 'folder' as const,
        path: '/sources',
        children: [
          {
            id: '2',
            name: 'amm_pool.move',
            type: 'file' as const,
            path: '/sources/amm_pool.move',
            language: 'rust',
            content: `module defi::amm_pool {
    use sui::object::{Self, UID};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::math;
    
    /// Liquidity Pool
    struct Pool<phantom A, phantom B> has key {
        id: UID,
        reserve_a: Balance<A>,
        reserve_b: Balance<B>,
        lp_supply: u64,
        fee_percentage: u64, // Fee in basis points (e.g., 30 = 0.3%)
    }
    
    /// LP Token
    struct LPToken<phantom A, phantom B> has key, store {
        id: UID,
        pool_id: address,
        amount: u64,
    }
    
    /// Events
    struct PoolCreated<phantom A, phantom B> has copy, drop {
        pool_id: address,
        reserve_a: u64,
        reserve_b: u64,
    }
    
    struct LiquidityAdded<phantom A, phantom B> has copy, drop {
        pool_id: address,
        amount_a: u64,
        amount_b: u64,
        lp_minted: u64,
    }
    
    struct LiquidityRemoved<phantom A, phantom B> has copy, drop {
        pool_id: address,
        amount_a: u64,
        amount_b: u64,
        lp_burned: u64,
    }
    
    struct Swapped<phantom A, phantom B> has copy, drop {
        pool_id: address,
        amount_in: u64,
        amount_out: u64,
        a_to_b: bool,
    }
    
    /// Create a new liquidity pool
    public entry fun create_pool<A, B>(
        coin_a: Coin<A>,
        coin_b: Coin<B>,
        fee_percentage: u64,
        ctx: &mut TxContext
    ) {
        let amount_a = coin::value(&coin_a);
        let amount_b = coin::value(&coin_b);
        
        assert!(amount_a > 0 && amount_b > 0, 0);
        assert!(fee_percentage <= 1000, 1); // Max 10% fee
        
        let pool = Pool<A, B> {
            id: object::new(ctx),
            reserve_a: coin::into_balance(coin_a),
            reserve_b: coin::into_balance(coin_b),
            lp_supply: 0,
            fee_percentage,
        };
        
        let pool_id = object::uid_to_address(&pool.id);
        
        event::emit(PoolCreated<A, B> {
            pool_id,
            reserve_a: amount_a,
            reserve_b: amount_b,
        });
        
        transfer::share_object(pool);
    }
    
    /// Add liquidity to pool
    public entry fun add_liquidity<A, B>(
        pool: &mut Pool<A, B>,
        coin_a: Coin<A>,
        coin_b: Coin<B>,
        ctx: &mut TxContext
    ) {
        let amount_a = coin::value(&coin_a);
        let amount_b = coin::value(&coin_b);
        
        let reserve_a = balance::value(&pool.reserve_a);
        let reserve_b = balance::value(&pool.reserve_b);
        
        // Calculate LP tokens to mint
        let lp_amount = if (pool.lp_supply == 0) {
            math::sqrt(amount_a * amount_b)
        } else {
            math::min(
                (amount_a * pool.lp_supply) / reserve_a,
                (amount_b * pool.lp_supply) / reserve_b
            )
        };
        
        balance::join(&mut pool.reserve_a, coin::into_balance(coin_a));
        balance::join(&mut pool.reserve_b, coin::into_balance(coin_b));
        pool.lp_supply = pool.lp_supply + lp_amount;
        
        let lp_token = LPToken<A, B> {
            id: object::new(ctx),
            pool_id: object::uid_to_address(&pool.id),
            amount: lp_amount,
        };
        
        event::emit(LiquidityAdded<A, B> {
            pool_id: object::uid_to_address(&pool.id),
            amount_a,
            amount_b,
            lp_minted: lp_amount,
        });
        
        transfer::public_transfer(lp_token, tx_context::sender(ctx));
    }
    
    /// Remove liquidity from pool
    public entry fun remove_liquidity<A, B>(
        pool: &mut Pool<A, B>,
        lp_token: LPToken<A, B>,
        ctx: &mut TxContext
    ) {
        let LPToken { id, pool_id: _, amount: lp_amount } = lp_token;
        object::delete(id);
        
        let reserve_a = balance::value(&pool.reserve_a);
        let reserve_b = balance::value(&pool.reserve_b);
        
        let amount_a = (lp_amount * reserve_a) / pool.lp_supply;
        let amount_b = (lp_amount * reserve_b) / pool.lp_supply;
        
        pool.lp_supply = pool.lp_supply - lp_amount;
        
        let coin_a = coin::from_balance(balance::split(&mut pool.reserve_a, amount_a), ctx);
        let coin_b = coin::from_balance(balance::split(&mut pool.reserve_b, amount_b), ctx);
        
        event::emit(LiquidityRemoved<A, B> {
            pool_id: object::uid_to_address(&pool.id),
            amount_a,
            amount_b,
            lp_burned: lp_amount,
        });
        
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(coin_a, sender);
        transfer::public_transfer(coin_b, sender);
    }
    
    /// Swap A for B
    public entry fun swap_a_to_b<A, B>(
        pool: &mut Pool<A, B>,
        coin_a: Coin<A>,
        min_amount_out: u64,
        ctx: &mut TxContext
    ) {
        let amount_in = coin::value(&coin_a);
        let reserve_a = balance::value(&pool.reserve_a);
        let reserve_b = balance::value(&pool.reserve_b);
        
        // Calculate output with fee
        let amount_in_with_fee = amount_in * (10000 - pool.fee_percentage);
        let amount_out = (amount_in_with_fee * reserve_b) / (reserve_a * 10000 + amount_in_with_fee);
        
        assert!(amount_out >= min_amount_out, 2);
        
        balance::join(&mut pool.reserve_a, coin::into_balance(coin_a));
        let coin_b = coin::from_balance(balance::split(&mut pool.reserve_b, amount_out), ctx);
        
        event::emit(Swapped<A, B> {
            pool_id: object::uid_to_address(&pool.id),
            amount_in,
            amount_out,
            a_to_b: true,
        });
        
        transfer::public_transfer(coin_b, tx_context::sender(ctx));
    }
    
    /// Swap B for A
    public entry fun swap_b_to_a<A, B>(
        pool: &mut Pool<A, B>,
        coin_b: Coin<B>,
        min_amount_out: u64,
        ctx: &mut TxContext
    ) {
        let amount_in = coin::value(&coin_b);
        let reserve_a = balance::value(&pool.reserve_a);
        let reserve_b = balance::value(&pool.reserve_b);
        
        let amount_in_with_fee = amount_in * (10000 - pool.fee_percentage);
        let amount_out = (amount_in_with_fee * reserve_a) / (reserve_b * 10000 + amount_in_with_fee);
        
        assert!(amount_out >= min_amount_out, 2);
        
        balance::join(&mut pool.reserve_b, coin::into_balance(coin_b));
        let coin_a = coin::from_balance(balance::split(&mut pool.reserve_a, amount_out), ctx);
        
        event::emit(Swapped<A, B> {
            pool_id: object::uid_to_address(&pool.id),
            amount_in,
            amount_out,
            a_to_b: false,
        });
        
        transfer::public_transfer(coin_a, tx_context::sender(ctx));
    }
}`
          }
        ]
      },
      {
        id: '3',
        name: 'tests',
        type: 'folder' as const,
        path: '/tests',
        children: [
          {
            id: '4',
            name: 'amm_tests.move',
            type: 'file' as const,
            path: '/tests/amm_tests.move',
            language: 'rust',
            content: `#[test_only]
module defi::amm_pool_tests {
    use defi::amm_pool;
    use sui::test_scenario;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    
    #[test]
    fun test_create_pool() {
        let admin = @0xAD;
        let scenario_val = test_scenario::begin(admin);
        let scenario = &mut scenario_val;
        
        {
            let coin_a = coin::mint_for_testing<SUI>(1000, test_scenario::ctx(scenario));
            let coin_b = coin::mint_for_testing<SUI>(1000, test_scenario::ctx(scenario));
            
            amm_pool::create_pool(coin_a, coin_b, 30, test_scenario::ctx(scenario));
        };
        
        test_scenario::end(scenario_val);
    }
}`
          }
        ]
      },
      {
        id: '5',
        name: 'Move.toml',
        type: 'file' as const,
        path: '/Move.toml',
        language: 'toml',
        content: `[package]
name = "DeFiAMM"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
defi = "0x0"
`
      },
      {
        id: '6',
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        language: 'markdown',
        content: `# DeFi AMM Pool

An Automated Market Maker (AMM) implementation on Sui with liquidity pools and token swaps.

## Features
- Create liquidity pools for any token pair
- Add/remove liquidity with LP tokens
- Token swaps with configurable fees
- Constant product formula (x * y = k)
- Event emission for all operations

## Build
\`\`\`bash
sui move build
\`\`\`

## Test
\`\`\`bash
sui move test
\`\`\`

## Usage

### Create Pool
\`\`\`bash
sui client call --function create_pool --module amm_pool --package <PACKAGE_ID> \\
  --args <COIN_A> <COIN_B> 30 --type-args <TYPE_A> <TYPE_B>
\`\`\`

### Add Liquidity
\`\`\`bash
sui client call --function add_liquidity --module amm_pool --package <PACKAGE_ID> \\
  --args <POOL_ID> <COIN_A> <COIN_B> --type-args <TYPE_A> <TYPE_B>
\`\`\`

### Swap Tokens
\`\`\`bash
sui client call --function swap_a_to_b --module amm_pool --package <PACKAGE_ID> \\
  --args <POOL_ID> <COIN_A> <MIN_OUT> --type-args <TYPE_A> <TYPE_B>
\`\`\`
`
      }
    ] as FileNode[]
  },
  
  token: {
    name: 'Custom Token',
    description: 'Create your own fungible token with minting and burning',
    category: 'token',
    difficulty: 'beginner',
    features: ['Token creation', 'Minting', 'Burning', 'Transfer'],
    files: [
      {
        id: '1',
        name: 'sources',
        type: 'folder' as const,
        path: '/sources',
        children: [
          {
            id: '2',
            name: 'token.move',
            type: 'file' as const,
            path: '/sources/token.move',
            language: 'rust',
            content: `module token::my_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    
    /// Token type
    struct MY_TOKEN has drop {}
    
    /// Initialize the token
    fun init(witness: MY_TOKEN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            9, // decimals
            b"MTK", // symbol
            b"My Token", // name
            b"A custom token on Sui", // description
            option::none(), // icon url
            ctx
        );
        
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }
    
    /// Mint new tokens
    public entry fun mint(
        treasury: &mut TreasuryCap<MY_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(treasury, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }
    
    /// Burn tokens
    public entry fun burn(
        treasury: &mut TreasuryCap<MY_TOKEN>,
        coin: Coin<MY_TOKEN>
    ) {
        coin::burn(treasury, coin);
    }
}`
          }
        ]
      },
      {
        id: '3',
        name: 'Move.toml',
        type: 'file' as const,
        path: '/Move.toml',
        language: 'toml',
        content: `[package]
name = "MyToken"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
token = "0x0"
`
      },
      {
        id: '4',
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        language: 'markdown',
        content: `# Custom Token

Create your own fungible token on Sui with minting and burning capabilities.

## Features
- Custom token creation
- Minting with treasury cap
- Burning tokens
- Standard Coin interface

## Build
\`\`\`bash
sui move build
\`\`\`

## Deploy
\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`
`
      }
    ] as FileNode[]
  },
  
  game: {
    name: 'Game Template',
    description: 'On-chain game with inventory and achievements',
    category: 'gaming',
    difficulty: 'intermediate',
    features: ['Player profiles', 'Inventory system', 'Achievements', 'Leaderboard'],
    files: [
      {
        id: '1',
        name: 'sources',
        type: 'folder' as const,
        path: '/sources',
        children: [
          {
            id: '2',
            name: 'game.move',
            type: 'file' as const,
            path: '/sources/game.move',
            language: 'rust',
            content: `module game::rpg {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::event;
    use std::vector;
    
    /// Player profile
    struct Player has key {
        id: UID,
        name: String,
        level: u64,
        experience: u64,
        health: u64,
        inventory: vector<Item>,
    }
    
    /// Game item
    struct Item has store, drop {
        name: String,
        item_type: u8, // 0: weapon, 1: armor, 2: potion
        power: u64,
    }
    
    /// Achievement
    struct Achievement has key, store {
        id: UID,
        name: String,
        description: String,
        unlocked_at: u64,
    }
    
    /// Events
    struct PlayerCreated has copy, drop {
        player_id: address,
        name: String,
    }
    
    struct LevelUp has copy, drop {
        player_id: address,
        new_level: u64,
    }
    
    struct ItemAcquired has copy, drop {
        player_id: address,
        item_name: String,
    }
    
    /// Create a new player
    public entry fun create_player(
        name: vector<u8>,
        ctx: &mut TxContext
    ) {
        let player = Player {
            id: object::new(ctx),
            name: string::utf8(name),
            level: 1,
            experience: 0,
            health: 100,
            inventory: vector::empty(),
        };
        
        event::emit(PlayerCreated {
            player_id: object::uid_to_address(&player.id),
            name: string::utf8(name),
        });
        
        transfer::transfer(player, tx_context::sender(ctx));
    }
    
    /// Add experience and level up
    public entry fun gain_experience(
        player: &mut Player,
        amount: u64,
    ) {
        player.experience = player.experience + amount;
        
        // Level up every 100 XP
        let new_level = player.experience / 100 + 1;
        if (new_level > player.level) {
            player.level = new_level;
            player.health = player.health + 10; // Bonus health
            
            event::emit(LevelUp {
                player_id: object::uid_to_address(&player.id),
                new_level,
            });
        };
    }
    
    /// Add item to inventory
    public entry fun acquire_item(
        player: &mut Player,
        name: vector<u8>,
        item_type: u8,
        power: u64,
    ) {
        let item = Item {
            name: string::utf8(name),
            item_type,
            power,
        };
        
        vector::push_back(&mut player.inventory, item);
        
        event::emit(ItemAcquired {
            player_id: object::uid_to_address(&player.id),
            item_name: string::utf8(name),
        });
    }
    
    /// Use a potion
    public entry fun use_potion(
        player: &mut Player,
        index: u64,
    ) {
        let item = vector::borrow(&player.inventory, index);
        assert!(item.item_type == 2, 0); // Must be a potion
        
        player.health = player.health + item.power;
        vector::remove(&mut player.inventory, index);
    }
    
    // Getters
    public fun get_player_level(player: &Player): u64 {
        player.level
    }
    
    public fun get_player_health(player: &Player): u64 {
        player.health
    }
}`
          }
        ]
      },
      {
        id: '3',
        name: 'tests',
        type: 'folder' as const,
        path: '/tests',
        children: [
          {
            id: '4',
            name: 'game_tests.move',
            type: 'file' as const,
            path: '/tests/game_tests.move',
            language: 'rust',
            content: `#[test_only]
module game::rpg_tests {
    use game::rpg;
    use sui::test_scenario;
    
    #[test]
    fun test_create_player() {
        let player_addr = @0xA;
        let scenario_val = test_scenario::begin(player_addr);
        let scenario = &mut scenario_val;
        
        {
            rpg::create_player(b"Hero", test_scenario::ctx(scenario));
        };
        
        test_scenario::next_tx(scenario, player_addr);
        
        {
            let player = test_scenario::take_from_sender<rpg::Player>(scenario);
            assert!(rpg::get_player_level(&player) == 1, 0);
            assert!(rpg::get_player_health(&player) == 100, 1);
            test_scenario::return_to_sender(scenario, player);
        };
        
        test_scenario::end(scenario_val);
    }
}`
          }
        ]
      },
      {
        id: '5',
        name: 'Move.toml',
        type: 'file' as const,
        path: '/Move.toml',
        language: 'toml',
        content: `[package]
name = "GameRPG"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
game = "0x0"
`
      },
      {
        id: '6',
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        language: 'markdown',
        content: `# Game RPG Template

An on-chain RPG game with player profiles, inventory, and progression system.

## Features
- Player creation and profiles
- Experience and leveling system
- Inventory management
- Item system (weapons, armor, potions)
- Event emission for game actions

## Build
\`\`\`bash
sui move build
\`\`\`

## Test
\`\`\`bash
sui move test
\`\`\`

## Gameplay

### Create Player
\`\`\`bash
sui client call --function create_player --module rpg --package <PACKAGE_ID> \\
  --args "YourName"
\`\`\`

### Gain Experience
\`\`\`bash
sui client call --function gain_experience --module rpg --package <PACKAGE_ID> \\
  --args <PLAYER_ID> 50
\`\`\`

### Acquire Item
\`\`\`bash
sui client call --function acquire_item --module rpg --package <PACKAGE_ID> \\
  --args <PLAYER_ID> "Sword" 0 50
\`\`\`
`
      }
    ] as FileNode[]
  }
};

export type TemplateKey = keyof typeof templates;
