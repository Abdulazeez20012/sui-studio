import { FileNode } from '../types/ide';
import { logger } from '../utils/logger';

/**
 * Service for initializing Move projects and modules
 */

export interface MoveProjectConfig {
  name: string;
  packageName?: string;
  author?: string;
  description?: string;
  edition?: string;
}

export interface MoveModuleConfig {
  moduleName: string;
  packageName: string;
  includeTests?: boolean;
}

class ProjectInitService {
  /**
   * Create a complete Move project structure with one click
   */
  createMoveProject(config: MoveProjectConfig): FileNode[] {
    const {
      name,
      packageName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      author = 'Your Name',
      description = `A Sui Move project: ${name}`,
      edition = '2024.beta',
    } = config;

    logger.info('Creating Move project:', name);

    const files: FileNode[] = [
      // Move.toml
      {
        id: `${name}-move-toml`,
        name: 'Move.toml',
        type: 'file',
        path: '/Move.toml',
        language: 'toml',
        content: this.generateMoveToml(packageName, author, description, edition),
      },
      // README.md
      {
        id: `${name}-readme`,
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        language: 'markdown',
        content: this.generateReadme(name, description),
      },
      // sources folder
      {
        id: `${name}-sources`,
        name: 'sources',
        type: 'folder',
        path: '/sources',
        children: [
          {
            id: `${name}-main-module`,
            name: `${packageName}.move`,
            type: 'file',
            path: `/sources/${packageName}.move`,
            language: 'move',
            content: this.generateMainModule(packageName),
          },
        ],
      },
      // tests folder
      {
        id: `${name}-tests`,
        name: 'tests',
        type: 'folder',
        path: '/tests',
        children: [
          {
            id: `${name}-test-file`,
            name: `${packageName}_tests.move`,
            type: 'file',
            path: `/tests/${packageName}_tests.move`,
            language: 'move',
            content: this.generateTestModule(packageName),
          },
        ],
      },
      // .gitignore
      {
        id: `${name}-gitignore`,
        name: '.gitignore',
        type: 'file',
        path: '/.gitignore',
        content: this.generateGitignore(),
      },
    ];

    return files;
  }

  /**
   * Create a new Move module in an existing folder
   */
  createMoveModule(config: MoveModuleConfig): { moduleFile: FileNode; testFile?: FileNode } {
    const { moduleName, packageName, includeTests = true } = config;

    logger.info('Creating Move module:', moduleName);

    const moduleFile: FileNode = {
      id: `module-${moduleName}`,
      name: `${moduleName}.move`,
      type: 'file',
      path: `/sources/${moduleName}.move`,
      language: 'move',
      content: this.generateModule(packageName, moduleName),
    };

    const testFile: FileNode | undefined = includeTests
      ? {
          id: `test-${moduleName}`,
          name: `${moduleName}_tests.move`,
          type: 'file',
          path: `/tests/${moduleName}_tests.move`,
          language: 'move',
          content: this.generateTestModule(packageName, moduleName),
        }
      : undefined;

    return { moduleFile, testFile };
  }

  /**
   * Generate Move.toml content
   */
  private generateMoveToml(
    packageName: string,
    author: string,
    description: string,
    edition: string
  ): string {
    return `[package]
name = "${packageName}"
version = "0.0.1"
edition = "${edition}"
authors = ["${author}"]

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${packageName} = "0x0"

[dev-addresses]
`;
  }

  /**
   * Generate README.md content
   */
  private generateReadme(name: string, description: string): string {
    return `# ${name}

${description}

## Features

- Modern Move 2024 syntax
- Ready for Sui mainnet
- Includes tests
- Production-ready structure

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

## Project Structure

\`\`\`
.
├── Move.toml          # Package configuration
├── sources/           # Move source files
│   └── *.move
├── tests/             # Test files
│   └── *_tests.move
└── README.md          # This file
\`\`\`

## Learn More

- [Sui Documentation](https://docs.sui.io/)
- [Move Book](https://move-language.github.io/move/)
- [Sui Move by Example](https://examples.sui.io/)

## License

MIT
`;
  }

  /**
   * Generate main module content
   */
  private generateMainModule(packageName: string): string {
    return `module ${packageName}::${packageName} {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::event;

    // ===== Structs =====

    /// Main object
    struct Item has key, store {
        id: UID,
        name: String,
        description: String,
        creator: address,
    }

    // ===== Events =====

    struct ItemCreated has copy, drop {
        item_id: address,
        creator: address,
        name: String,
    }

    // ===== Public Functions =====

    /// Create a new item
    public entry fun create_item(
        name: vector<u8>,
        description: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let item = Item {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            creator: sender,
        };

        event::emit(ItemCreated {
            item_id: object::uid_to_address(&item.id),
            creator: sender,
            name: string::utf8(name),
        });

        transfer::public_transfer(item, sender);
    }

    /// Transfer item to another address
    public entry fun transfer_item(
        item: Item,
        recipient: address,
    ) {
        transfer::public_transfer(item, recipient);
    }

    // ===== Getters =====

    public fun get_name(item: &Item): String {
        item.name
    }

    public fun get_description(item: &Item): String {
        item.description
    }

    public fun get_creator(item: &Item): address {
        item.creator
    }
}
`;
  }

  /**
   * Generate module content
   */
  private generateModule(packageName: string, moduleName: string): string {
    return `module ${packageName}::${moduleName} {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // ===== Structs =====

    struct ${this.capitalize(moduleName)} has key {
        id: UID,
        // Add your fields here
    }

    // ===== Public Functions =====

    /// Initialize the module
    public entry fun create(ctx: &mut TxContext) {
        let obj = ${this.capitalize(moduleName)} {
            id: object::new(ctx),
        };
        transfer::transfer(obj, tx_context::sender(ctx));
    }

    // Add your functions here
}
`;
  }

  /**
   * Generate test module content
   */
  private generateTestModule(packageName: string, moduleName?: string): string {
    const module = moduleName || packageName;
    return `#[test_only]
module ${packageName}::${module}_tests {
    use ${packageName}::${module};
    use sui::test_scenario;

    #[test]
    fun test_create() {
        let user = @0xA;
        let scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;

        {
            ${module}::create(test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, user);

        {
            // Add your test assertions here
        };

        test_scenario::end(scenario_val);
    }

    // Add more tests here
}
`;
  }

  /**
   * Generate .gitignore content
   */
  private generateGitignore(): string {
    return `# Build outputs
build/
*.mv
*.json

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`;
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const projectInitService = new ProjectInitService();
