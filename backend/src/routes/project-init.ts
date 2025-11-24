import express, { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

const router: Router = express.Router();

router.use(authenticateToken);

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  template: z.enum(['empty', 'hello_world', 'defi', 'nft', 'gaming']).optional(),
});

// Create a new Sui Move project structure
router.post('/create', async (req: AuthRequest, res) => {
  try {
    const { name, template = 'empty' } = createProjectSchema.parse(req.body);

    // Sanitize project name
    const projectName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const workspaceDir = path.join('/tmp', `sui-workspace-${req.userId}`);
    const projectDir = path.join(workspaceDir, projectName);

    // Check if project already exists
    try {
      await fs.access(projectDir);
      return res.status(400).json({ 
        error: 'Project already exists',
        message: `A project named "${projectName}" already exists in your workspace` 
      });
    } catch {
      // Project doesn't exist, continue
    }

    // Create project directory
    await fs.mkdir(projectDir, { recursive: true });

    // Create subdirectories
    await fs.mkdir(path.join(projectDir, 'sources'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'tests'), { recursive: true });

    // Create Move.toml
    const moveToml = generateMoveToml(projectName);
    await fs.writeFile(path.join(projectDir, 'Move.toml'), moveToml);

    // Create README.md
    const readme = generateReadme(projectName);
    await fs.writeFile(path.join(projectDir, 'README.md'), readme);

    // Create .gitignore
    const gitignore = `build/
.DS_Store
*.swp
*.swo
*~
`;
    await fs.writeFile(path.join(projectDir, '.gitignore'), gitignore);

    // Create template-specific files
    const templateFiles = await generateTemplateFiles(projectName, template);
    for (const [filePath, content] of Object.entries(templateFiles)) {
      const fullPath = path.join(projectDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }

    // Read the created structure
    const structure = await readProjectStructure(projectDir, projectName);

    res.json({
      success: true,
      message: `Project "${projectName}" created successfully`,
      projectName,
      projectPath: projectDir,
      structure,
    });
  } catch (error: any) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get project structure
router.get('/structure/:projectName', async (req: AuthRequest, res) => {
  try {
    const { projectName } = req.params;
    const workspaceDir = path.join('/tmp', `sui-workspace-${req.userId}`);
    const projectDir = path.join(workspaceDir, projectName);

    const structure = await readProjectStructure(projectDir, projectName);

    res.json({
      success: true,
      projectName,
      structure,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions

function generateMoveToml(projectName: string): string {
  return `[package]
name = "${projectName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${projectName} = "0x0"

[dev-dependencies]
`;
}

function generateReadme(projectName: string): string {
  return `# ${projectName}

A Sui Move smart contract project.

## Project Structure

\`\`\`
${projectName}/
├── Move.toml          # Package manifest
├── sources/           # Move source files
│   └── ${projectName}.move
├── tests/             # Test files
│   └── ${projectName}_tests.move
└── README.md          # This file
\`\`\`

## Building

\`\`\`bash
sui move build
\`\`\`

## Testing

\`\`\`bash
sui move test
\`\`\`

## Deploying

\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`

## Learn More

- [Sui Documentation](https://docs.sui.io/)
- [Move Language](https://move-language.github.io/move/)
- [Sui Move by Example](https://examples.sui.io/)
`;
}

async function generateTemplateFiles(
  projectName: string,
  template: string
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  switch (template) {
    case 'hello_world':
      files[`sources/${projectName}.move`] = `module ${projectName}::hello_world {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// A simple object that holds a greeting message
    public struct Hello has key, store {
        id: UID,
        message: vector<u8>
    }

    /// Create a new Hello object with a custom message
    public entry fun create(message: vector<u8>, ctx: &mut TxContext) {
        let hello = Hello {
            id: object::new(ctx),
            message
        };
        transfer::transfer(hello, tx_context::sender(ctx));
    }

    /// Update the message in a Hello object
    public entry fun update(hello: &mut Hello, new_message: vector<u8>) {
        hello.message = new_message;
    }

    /// Delete a Hello object
    public entry fun delete(hello: Hello) {
        let Hello { id, message: _ } = hello;
        object::delete(id);
    }
}
`;

      files[`tests/${projectName}_tests.move`] = `#[test_only]
module ${projectName}::hello_world_tests {
    use ${projectName}::hello_world::{Self, Hello};
    use sui::test_scenario;

    #[test]
    fun test_create() {
        let user = @0x1;
        let scenario = test_scenario::begin(user);
        {
            hello_world::create(b"Hello, Sui!", test_scenario::ctx(&mut scenario));
        };
        test_scenario::next_tx(&mut scenario, user);
        {
            let hello = test_scenario::take_from_sender<Hello>(&scenario);
            test_scenario::return_to_sender(&scenario, hello);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_update() {
        let user = @0x1;
        let scenario = test_scenario::begin(user);
        {
            hello_world::create(b"Hello", test_scenario::ctx(&mut scenario));
        };
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut hello = test_scenario::take_from_sender<Hello>(&scenario);
            hello_world::update(&mut hello, b"Updated!");
            test_scenario::return_to_sender(&scenario, hello);
        };
        test_scenario::end(scenario);
    }
}
`;
      break;

    case 'defi':
      files[`sources/${projectName}.move`] = `module ${projectName}::amm_pool {
    use sui::object::{Self, UID};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::math;

    /// Liquidity pool for token swaps
    public struct Pool<phantom CoinA, phantom CoinB> has key {
        id: UID,
        coin_a: Balance<CoinA>,
        coin_b: Balance<CoinB>,
        lp_supply: u64,
    }

    /// LP token representing pool ownership
    public struct LPCoin<phantom CoinA, phantom CoinB> has key, store {
        id: UID,
        pool_id: address,
        value: u64,
    }

    /// Create a new liquidity pool
    public entry fun create_pool<CoinA, CoinB>(
        coin_a: Coin<CoinA>,
        coin_b: Coin<CoinB>,
        ctx: &mut TxContext
    ) {
        let coin_a_value = coin::value(&coin_a);
        let coin_b_value = coin::value(&coin_b);
        
        let lp_supply = math::sqrt(coin_a_value * coin_b_value);

        let pool = Pool<CoinA, CoinB> {
            id: object::new(ctx),
            coin_a: coin::into_balance(coin_a),
            coin_b: coin::into_balance(coin_b),
            lp_supply,
        };

        transfer::share_object(pool);
    }

    /// Add liquidity to the pool
    public entry fun add_liquidity<CoinA, CoinB>(
        pool: &mut Pool<CoinA, CoinB>,
        coin_a: Coin<CoinA>,
        coin_b: Coin<CoinB>,
        ctx: &mut TxContext
    ) {
        let coin_a_value = coin::value(&coin_a);
        let coin_b_value = coin::value(&coin_b);

        balance::join(&mut pool.coin_a, coin::into_balance(coin_a));
        balance::join(&mut pool.coin_b, coin::into_balance(coin_b));

        let lp_tokens = math::min(coin_a_value, coin_b_value);
        pool.lp_supply = pool.lp_supply + lp_tokens;

        let lp_coin = LPCoin<CoinA, CoinB> {
            id: object::new(ctx),
            pool_id: object::uid_to_address(&pool.id),
            value: lp_tokens,
        };

        transfer::transfer(lp_coin, tx_context::sender(ctx));
    }

    /// Swap coin A for coin B
    public entry fun swap_a_to_b<CoinA, CoinB>(
        pool: &mut Pool<CoinA, CoinB>,
        coin_a: Coin<CoinA>,
        ctx: &mut TxContext
    ) {
        let input_value = coin::value(&coin_a);
        let a_balance = balance::value(&pool.coin_a);
        let b_balance = balance::value(&pool.coin_b);

        // Simple constant product formula: x * y = k
        let output_value = (input_value * b_balance) / (a_balance + input_value);

        balance::join(&mut pool.coin_a, coin::into_balance(coin_a));
        let coin_b = coin::from_balance(
            balance::split(&mut pool.coin_b, output_value),
            ctx
        );

        transfer::public_transfer(coin_b, tx_context::sender(ctx));
    }
}
`;

      files[`tests/${projectName}_tests.move`] = `#[test_only]
module ${projectName}::amm_pool_tests {
    // Add your DeFi tests here
}
`;
      break;

    case 'nft':
      files[`sources/${projectName}.move`] = `module ${projectName}::nft_collection {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use std::string::{Self, String};

    /// NFT Collection
    public struct Collection has key {
        id: UID,
        name: String,
        description: String,
        creator: address,
        total_supply: u64,
    }

    /// Individual NFT
    public struct NFT has key, store {
        id: UID,
        collection_id: address,
        name: String,
        description: String,
        url: Url,
        attributes: vector<u8>,
    }

    /// Create a new NFT collection
    public entry fun create_collection(
        name: vector<u8>,
        description: vector<u8>,
        ctx: &mut TxContext
    ) {
        let collection = Collection {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            creator: tx_context::sender(ctx),
            total_supply: 0,
        };
        transfer::share_object(collection);
    }

    /// Mint a new NFT
    public entry fun mint_nft(
        collection: &mut Collection,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        attributes: vector<u8>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            collection_id: object::uid_to_address(&collection.id),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            attributes,
        };

        collection.total_supply = collection.total_supply + 1;
        transfer::transfer(nft, recipient);
    }

    /// Transfer NFT to another address
    public entry fun transfer_nft(
        nft: NFT,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::transfer(nft, recipient);
    }

    /// Burn an NFT
    public entry fun burn_nft(
        collection: &mut Collection,
        nft: NFT
    ) {
        let NFT { id, collection_id: _, name: _, description: _, url: _, attributes: _ } = nft;
        object::delete(id);
        collection.total_supply = collection.total_supply - 1;
    }
}
`;

      files[`tests/${projectName}_tests.move`] = `#[test_only]
module ${projectName}::nft_collection_tests {
    // Add your NFT tests here
}
`;
      break;

    case 'gaming':
      files[`sources/${projectName}.move`] = `module ${projectName}::game_inventory {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};

    /// Player inventory
    public struct Inventory has key {
        id: UID,
        owner: address,
        items: Table<u64, Item>,
        capacity: u64,
    }

    /// Game item
    public struct Item has store {
        item_id: u64,
        name: vector<u8>,
        rarity: u8,
        power: u64,
        durability: u64,
    }

    /// Create a new inventory for a player
    public entry fun create_inventory(
        capacity: u64,
        ctx: &mut TxContext
    ) {
        let inventory = Inventory {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            items: table::new(ctx),
            capacity,
        };
        transfer::transfer(inventory, tx_context::sender(ctx));
    }

    /// Add an item to inventory
    public entry fun add_item(
        inventory: &mut Inventory,
        item_id: u64,
        name: vector<u8>,
        rarity: u8,
        power: u64,
        durability: u64,
        _ctx: &mut TxContext
    ) {
        assert!(table::length(&inventory.items) < inventory.capacity, 0);
        
        let item = Item {
            item_id,
            name,
            rarity,
            power,
            durability,
        };
        
        table::add(&mut inventory.items, item_id, item);
    }

    /// Remove an item from inventory
    public entry fun remove_item(
        inventory: &mut Inventory,
        item_id: u64,
        _ctx: &mut TxContext
    ) {
        assert!(table::contains(&inventory.items, item_id), 1);
        let Item { item_id: _, name: _, rarity: _, power: _, durability: _ } = 
            table::remove(&mut inventory.items, item_id);
    }

    /// Upgrade item power
    public entry fun upgrade_item(
        inventory: &mut Inventory,
        item_id: u64,
        power_increase: u64,
        _ctx: &mut TxContext
    ) {
        assert!(table::contains(&inventory.items, item_id), 1);
        let item = table::borrow_mut(&mut inventory.items, item_id);
        item.power = item.power + power_increase;
    }
}
`;

      files[`tests/${projectName}_tests.move`] = `#[test_only]
module ${projectName}::game_inventory_tests {
    // Add your gaming tests here
}
`;
      break;

    default: // empty
      files[`sources/${projectName}.move`] = `module ${projectName}::${projectName} {
    // Your Move code here
}
`;

      files[`tests/${projectName}_tests.move`] = `#[test_only]
module ${projectName}::${projectName}_tests {
    // Your tests here
}
`;
  }

  return files;
}

async function readProjectStructure(
  projectDir: string,
  projectName: string
): Promise<any> {
  const structure: any = {
    name: projectName,
    type: 'folder',
    path: '/',
    children: [],
  };

  try {
    const entries = await fs.readdir(projectDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(projectDir, entry.name);
      
      if (entry.isDirectory()) {
        const subStructure = await readDirectory(fullPath, `/${entry.name}`);
        structure.children.push(subStructure);
      } else {
        const content = await fs.readFile(fullPath, 'utf-8');
        const ext = path.extname(entry.name).slice(1);
        const languageMap: Record<string, string> = {
          'move': 'rust',
          'toml': 'toml',
          'md': 'markdown',
          'gitignore': 'plaintext',
        };

        structure.children.push({
          name: entry.name,
          type: 'file',
          path: `/${entry.name}`,
          content,
          language: languageMap[ext] || 'plaintext',
        });
      }
    }
  } catch (error) {
    console.error('Error reading project structure:', error);
  }

  return structure;
}

async function readDirectory(dirPath: string, relativePath: string): Promise<any> {
  const dirName = path.basename(dirPath);
  const structure: any = {
    name: dirName,
    type: 'folder',
    path: relativePath,
    children: [],
  };

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const entryPath = `${relativePath}/${entry.name}`;

      if (entry.isDirectory()) {
        const subStructure = await readDirectory(fullPath, entryPath);
        structure.children.push(subStructure);
      } else {
        const content = await fs.readFile(fullPath, 'utf-8');
        const ext = path.extname(entry.name).slice(1);
        const languageMap: Record<string, string> = {
          'move': 'rust',
          'toml': 'toml',
          'md': 'markdown',
          'gitignore': 'plaintext',
        };

        structure.children.push({
          name: entry.name,
          type: 'file',
          path: entryPath,
          content,
          language: languageMap[ext] || 'plaintext',
        });
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }

  return structure;
}

export default router;
