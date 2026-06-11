#!/usr/bin/env node

/**
 * Check for imports from 'icons/collection' outside of allowed files
 *
 * Usage: node scripts/check-icon-imports.cjs
 */

const { execSync } = require('child_process');

// Files that are allowed to import from icons/collection
const ALLOWED_FILES = [
  'src/pages/Dev/',
  'src/icons/collectionByGame.tsx',
  'src/icons/collection.ts', // The file itself
];

try {
  // Search for imports from icons/collection (must start with 'import')
  const grepCommand = 'grep -rn "^import.*from.*icons/collection" src/ || true';
  const result = execSync(grepCommand, { encoding: 'utf-8' });

  if (!result.trim()) {
    console.log('✅ No imports from icons/collection found');
    process.exit(0);
  }

  const lines = result.trim().split('\n');
  const violations = lines.filter((line) => {
    const filePath = line.split(':')[0];
    return !ALLOWED_FILES.some((allowed) => filePath.includes(allowed));
  });

  if (violations.length === 0) {
    console.log('✅ All icons/collection imports are in allowed files');
    process.exit(0);
  }

  console.error('❌ Found unauthorized imports from icons/collection:\n');
  violations.forEach((violation) => {
    console.error(`  ${violation}`);
  });
  console.error('\n⚠️  Use direct imports instead:');
  console.error('   ❌ BAD:  import { MyIcon } from \'icons/collection\';');
  console.error('   ✅ GOOD: import { MyIcon } from \'icons/MyIcon\';\n');

  process.exit(1);
} catch (error) {
  console.error('Error running check:', error.message);
  process.exit(1);
}
