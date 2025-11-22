import { FileNode } from '../types/ide';

export const templates = {
  helloWorld: {
    name: 'Hello World',
    description: 'A simple Sui Move project',
    files: [
      {
        id: '1',
        name: 'src',
        type: 'folder' as const,
        path: '/src',
        children: [
          {
            id: '2',
            name: 'main.move',
            type: 'file' as const,
            path: '/src/main.move',
            language: 'rust',
            content: `module hello_world::hello {
    use std::string;
    
    public entry fun say_hello() {
        let message = string::utf8(b"Hello, Sui!");
        std::debug::print(&message);
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
name = "HelloWorld"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
hello_world = "0x0"
`
      },
      {
        id: '4',
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        language: 'markdown',
        content: '# Hello World Sui Project\n\nA simple Sui Move project to get started.\n'
      }
    ] as FileNode[]
  },
  
  nft: {
    name: 'NFT Collection',
    description: 'Create and manage NFT collections',
    files: [
      {
        id: '1',
        name: 'src',
        type: 'folder' as const,
        path: '/src',
        children: [
          {
            id: '2',
            name: 'nft.move',
            type: 'file' as const,
            path: '/src/nft.move',
            language: 'rust',
            content: `module nft::collection {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    
    struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: String,
    }
    
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: string::utf8(url),
        };
        
        transfer::transfer(nft, tx_context::sender(ctx));
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
name = "NFTCollection"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
nft = "0x0"
`
      }
    ] as FileNode[]
  },
  
  defi: {
    name: 'DeFi Protocol',
    description: 'AMM liquidity pool template',
    files: [
      {
        id: '1',
        name: 'src',
        type: 'folder' as const,
        path: '/src',
        children: [
          {
            id: '2',
            name: 'pool.move',
            type: 'file' as const,
            path: '/src/pool.move',
            language: 'rust',
            content: `module defi::amm_pool {
    use sui::object::{Self, UID};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::tx_context::TxContext;
    
    struct Pool<phantom A, phantom B> has key {
        id: UID,
        reserve_a: Balance<A>,
        reserve_b: Balance<B>,
        lp_supply: u64,
    }
    
    public fun create_pool<A, B>(
        coin_a: Coin<A>,
        coin_b: Coin<B>,
        ctx: &mut TxContext
    ): Pool<A, B> {
        Pool {
            id: object::new(ctx),
            reserve_a: coin::into_balance(coin_a),
            reserve_b: coin::into_balance(coin_b),
            lp_supply: 0,
        }
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
name = "DeFiProtocol"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
defi = "0x0"
`
      }
    ] as FileNode[]
  }
};

export type TemplateKey = keyof typeof templates;
