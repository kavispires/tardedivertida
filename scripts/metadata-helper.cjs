#!/usr/bin/env node

/**
 * Interactive helper script to manage game metadata.md files.
 *
 * Usage: node scripts/metadata-helper.cjs
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// -----------------------------------------------------------------------------
// Core Utilities
// -----------------------------------------------------------------------------

function getValidGames() {
  const gamesDir = path.resolve(__dirname, '../src/games');
  if (!fs.existsSync(gamesDir)) {
    console.error(`❌ Games directory not found at: ${gamesDir}`);
    process.exit(1);
  }

  // We rely on checking valid game directories (excluding _template)
  return fs.readdirSync(gamesDir).filter(dir => {
    const fullPath = path.join(gamesDir, dir);
    return fs.statSync(fullPath).isDirectory() && dir !== '_template';
  });
}

function getGameMetadata(gameDir) {
  const gamesDir = path.resolve(__dirname, '../src/games');
  const gameInfoPath = path.join(gamesDir, gameDir, 'game-info.json');

  if (!fs.existsSync(gameInfoPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(gameInfoPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Action 1: Add Missing Metadata
// -----------------------------------------------------------------------------

async function addMissingMetadata() {
  console.log('\n🔍 Scanning for missing metadata files...');
  const games = getValidGames();
  const gamesDir = path.resolve(__dirname, '../src/games');

  let addedCount = 0;

  for (const gameDir of games) {
    const gameFolderPath = path.join(gamesDir, gameDir);
    const metadataPath = path.join(gameFolderPath, 'metadata.md');

    if (!fs.existsSync(metadataPath)) {
      const gameInfo = getGameMetadata(gameDir) || {};
      const titlePt = gameInfo.title?.pt || gameInfo.gameName || gameDir;
      const gameName = gameInfo.gameName || gameDir;
      const gameCode = gameInfo.gameCode || 'N/A';

      const template = `## Metadata for ${titlePt}

### Basic Info

- Collection: \`${gameName}\`
- Code: \`${gameCode}\`

### External Dependencies

- Image Rules: 🔘
- Image Background: 🔘
- Video Background: 🔘

### Migrations

- TBD

### Report

- TBD
`;

      fs.writeFileSync(metadataPath, template, 'utf8');
      console.log(`✅ Created missing metadata.md for ${gameDir}`);
      addedCount++;
    }
  }

  console.log(`\n✨ Done! Added metadata to ${addedCount} game(s).\n`);
}

// -----------------------------------------------------------------------------
// Action 2: Add Migration Item
// -----------------------------------------------------------------------------

async function addMigrationItem() {
  const input = await prompt('\n📝 Enter migration titles (comma-separated): ');
  if (!input) {
    console.log('❌ Migration titles cannot be empty. Aborting.');
    return;
  }

  // Split by comma, trim spaces, and remove empty entries
  const migrations = input.split(',').map(m => m.trim()).filter(m => m);

  if (migrations.length === 0) {
    console.log('❌ No valid migration titles provided. Aborting.');
    return;
  }

  console.log(`\n🚀 Adding ${migrations.length} migration(s) to all games...`);
  const games = getValidGames();
  const gamesDir = path.resolve(__dirname, '../src/games');
  let updatedCount = 0;

  for (const gameDir of games) {
    const metadataPath = path.join(gamesDir, gameDir, 'metadata.md');

    if (fs.existsSync(metadataPath)) {
      let content = fs.readFileSync(metadataPath, 'utf8');

      // Create the block of new migration lines
      const newMigrationLines = migrations.map(m => `- ${m}: 🔘`).join('\n');

      // Replace "- TBD" if it's the only thing there, otherwise append it
      if (content.includes('### Migrations\n\n- TBD')) {
        content = content.replace('### Migrations\n\n- TBD', `### Migrations\n\n${newMigrationLines}`);
      } else {
        // Insert after the Migrations header block
        content = content.replace('### Migrations\n\n', `### Migrations\n\n${newMigrationLines}\n`);
      }

      fs.writeFileSync(metadataPath, content, 'utf8');
      updatedCount++;
    }
  }

  console.log(`\n✨ Done! Appended migrations to ${updatedCount} metadata file(s).\n`);
}

// -----------------------------------------------------------------------------
// Action 3: Run Report
// -----------------------------------------------------------------------------

async function runReport() {
  const target = await prompt('\n🎯 Enter game name (e.g., adedanhx) or "." for all games: ');
  if (!target) {
    console.log('❌ Target cannot be empty. Aborting.');
    return;
  }

  let gamesToProcess = [];
  if (target === '.') {
    gamesToProcess = getValidGames();
  } else {
    gamesToProcess = [target];
  }

  console.log(`\n📊 Running report for ${gamesToProcess.length} game(s)...`);
  const gamesDir = path.resolve(__dirname, '../src/games');
  let updatedCount = 0;

  for (const gameDir of gamesToProcess) {
    const gameInfo = getGameMetadata(gameDir);
    const metadataPath = path.join(gamesDir, gameDir, 'metadata.md');

    if (gameInfo && fs.existsSync(metadataPath)) {
      let content = fs.readFileSync(metadataPath, 'utf8');

      // 1. Check rules
      const hasEnRules = gameInfo.rules?.en && Array.isArray(gameInfo.rules.en) && gameInfo.rules.en.length > 1;
      const hasPtRules = gameInfo.rules?.pt && Array.isArray(gameInfo.rules.pt) && gameInfo.rules.pt.length > 1;
      const rulesEmoji = (hasEnRules && hasPtRules) ? '✅' : '❌';

      const rulesReportLine = `- Rules (EN/PT): ${rulesEmoji}`;

      // 2. Update the Report section
      if (content.includes('### Report\n\n- TBD')) {
        // First time running report: replace TBD
        content = content.replace('### Report\n\n- TBD', `### Report\n\n${rulesReportLine}`);
      } else {
        // Subsequent runs: replace just the Rules line if it exists, or append it to the report section
        const rulesRegex = /- Rules \(EN\/PT\): [^\n]+/;
        if (rulesRegex.test(content)) {
          content = content.replace(rulesRegex, rulesReportLine);
        } else {
          // If we have other report items but no rules item, append it at the end of the file
          content += `\n${rulesReportLine}`;
        }
      }

      fs.writeFileSync(metadataPath, content, 'utf8');

      if (target !== '.') {
         console.log(`✅ ${gameDir} -> ${rulesReportLine}`);
      }
      updatedCount++;
    } else if (target !== '.') {
      console.log(`⏭️  Skipped ${gameDir} (Missing game-info.json or metadata.md)`);
    }
  }

  console.log(`\n✨ Report completed for ${updatedCount} game(s).\n`);
}

// -----------------------------------------------------------------------------
// Main Menu
// -----------------------------------------------------------------------------

async function main() {
  console.log('====================================');
  console.log('🛠️  Game Metadata Helper');
  console.log('====================================');
  console.log('1. Add Missing Metadata (Creates missing files)');
  console.log('2. Add Migration Item (Appends to Migrations section)');
  console.log('3. Run Report (Checks game data and updates Report section)');
  console.log('0. Exit');

  const choice = await prompt('\nSelect an option (0-3): ');

  switch (choice) {
    case '1':
      await addMissingMetadata();
      break;
    case '2':
      await addMigrationItem();
      break;
    case '3':
      await runReport();
      break;
    case '0':
      console.log('👋 Exiting...');
      break;
    default:
      console.log('❌ Invalid option. Exiting.');
      break;
  }

  rl.close();
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
