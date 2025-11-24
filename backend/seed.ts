import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed extensions
  const extensions = [
    {
      id: 'core-analyzer',
      name: 'Core Analyzer',
      publisher: 'Sui Studio Team',
      description: 'Advanced Sui Move code analysis, debugging, and optimization tools',
      version: '2.1.0',
      category: 'Analysis',
      icon: '🔍',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=sui-studio.core-analyzer',
      featured: true,
      downloads: 15420,
      rating: 4.8,
    },
    {
      id: 'move-syntax',
      name: 'Move Language Support',
      publisher: 'Move Foundation',
      description: 'Syntax highlighting, IntelliSense, and code completion for Move',
      version: '1.5.2',
      category: 'Language',
      icon: '📝',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=move-foundation.move-syntax',
      featured: true,
      downloads: 28350,
      rating: 4.9,
    },
    {
      id: 'sui-debugger',
      name: 'Sui Debugger',
      publisher: 'Mysten Labs',
      description: 'Interactive debugger for Sui Move smart contracts',
      version: '1.8.0',
      category: 'Debugging',
      icon: '🐛',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=mysten.sui-debugger',
      featured: true,
      downloads: 12890,
      rating: 4.7,
    },
    {
      id: 'move-formatter',
      name: 'Move Formatter',
      publisher: 'Code Style',
      description: 'Automatic code formatting and style enforcement for Move',
      version: '1.2.1',
      category: 'Formatting',
      icon: '✨',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=codestyle.move-formatter',
      featured: false,
      downloads: 9240,
      rating: 4.6,
    },
    {
      id: 'sui-snippets',
      name: 'Sui Snippets',
      publisher: 'DevTools',
      description: 'Code snippets for common Sui Move patterns and templates',
      version: '2.0.0',
      category: 'Snippets',
      icon: '⚡',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=devtools.sui-snippets',
      featured: false,
      downloads: 18750,
      rating: 4.8,
    },
    {
      id: 'move-linter',
      name: 'Move Linter',
      publisher: 'Quality Tools',
      description: 'Real-time linting and error detection for Move code',
      version: '1.4.3',
      category: 'Linting',
      icon: '🔧',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=quality.move-linter',
      featured: false,
      downloads: 11200,
      rating: 4.5,
    },
    {
      id: 'sui-test-runner',
      name: 'Sui Test Runner',
      publisher: 'Testing Pro',
      description: 'Run and debug Sui Move tests directly in VS Code',
      version: '1.6.0',
      category: 'Testing',
      icon: '🧪',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=testing.sui-test-runner',
      featured: false,
      downloads: 8930,
      rating: 4.7,
    },
    {
      id: 'move-docs',
      name: 'Move Documentation',
      publisher: 'Docs Team',
      description: 'Inline documentation and hover information for Move APIs',
      version: '1.3.0',
      category: 'Documentation',
      icon: '📚',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=docs.move-docs',
      featured: false,
      downloads: 7650,
      rating: 4.4,
    },
  ];

  for (const ext of extensions) {
    await prisma.extension.upsert({
      where: { id: ext.id },
      update: ext,
      create: ext,
    });
  }

  console.log(`✅ Seeded ${extensions.length} extensions`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
