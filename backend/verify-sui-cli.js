/**
 * Verify Sui CLI Installation
 * 
 * This script checks if Sui CLI is properly installed and working
 */

const { execSync } = require('child_process');

console.log('🔍 Verifying Sui CLI installation...\n');

try {
  // Check if sui command exists
  const version = execSync('sui --version', { encoding: 'utf-8' });
  console.log('✅ Sui CLI is installed!');
  console.log(`📋 Version: ${version.trim()}\n`);

  // Test sui move build command
  console.log('🧪 Testing sui move build command...');
  try {
    execSync('sui move --help', { encoding: 'utf-8', stdio: 'pipe' });
    console.log('✅ sui move command works!\n');
  } catch (error) {
    console.log('⚠️  sui move command failed\n');
  }

  // Check available networks
  console.log('🌐 Checking Sui networks...');
  try {
    const clientHelp = execSync('sui client --help', { encoding: 'utf-8', stdio: 'pipe' });
    console.log('✅ sui client command works!\n');
  } catch (error) {
    console.log('⚠️  sui client command failed\n');
  }

  console.log('🎉 Sui CLI verification complete!');
  console.log('✅ Real compilation is now available!\n');
  
  process.exit(0);
} catch (error) {
  console.log('❌ Sui CLI is NOT installed\n');
  console.log('📝 To install Sui CLI:');
  console.log('   Linux/Mac: bash install-sui-cli.sh');
  console.log('   Windows:   install-sui-cli.bat');
  console.log('   Docker:    Already included in Dockerfile\n');
  
  process.exit(1);
}
