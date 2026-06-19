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
  let skippedDuplicates = 0;

  for (const gameDir of games) {
    const metadataPath = path.join(gamesDir, gameDir, 'metadata.md');

    if (fs.existsSync(metadataPath)) {
      let content = fs.readFileSync(metadataPath, 'utf8');

      // Extract existing migration items to check for duplicates
      const migrationsSection = content.match(/### Migrations\n\n([\s\S]*?)(?=\n###|$)/);
      const existingMigrations = new Set();

      if (migrationsSection && migrationsSection[1]) {
        const lines = migrationsSection[1].split('\n');
        lines.forEach(line => {
          // Extract only the text before the colon, ignore emoji/status
          const match = line.match(/^- (.+?):\s*/);
          if (match) {
            existingMigrations.add(match[1].trim());
          }
        });
      }

      // Filter out duplicates
      const newMigrations = migrations.filter(m => {
        if (existingMigrations.has(m)) {
          skippedDuplicates++;
          return false;
        }
        return true;
      });

      // Only proceed if there are new migrations to add
      if (newMigrations.length > 0) {
        const newMigrationLines = newMigrations.map(m => `- ${m}: 🔘`).join('\n');

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
  }

  if (skippedDuplicates > 0) {
    console.log(`\n⏭️  Skipped ${skippedDuplicates} duplicate migration item(s).`);
  }
  console.log(`\n✨ Done! Appended migrations to ${updatedCount} metadata file(s).\n`);
}

// -----------------------------------------------------------------------------
// Action 3: Run Report
// -----------------------------------------------------------------------------

const checksDir = path.resolve(__dirname, 'checks');

function runAllChecks(gameInfo, gameDir, gameFolderPath) {
  if (!fs.existsSync(checksDir)) return [];

  const checkFiles = fs.readdirSync(checksDir).filter(f => f.endsWith('.cjs'));
  const reportLines = [];
  const results = { passed: [], failed: [] };

  for (const file of checkFiles) {
    const check = require(path.join(checksDir, file));
    try {
      // Failsafe if the JSON doesn't exist at all
    if (!gameInfo) {
      const label = check.id || file;
      reportLines.push(`- ${label}: ❌ game-info.json is missing or invalid`);
      results.failed.push({
        label: label,
        error: 'game-info.json is missing or invalid'
      });
      continue;
    }

      const result = check.run(gameInfo, gameDir, gameFolderPath);
      const emoji = result.passed ? '✅' : '❌';

      // Append the error reason if the check failed
      const errorText = (!result.passed && result.error) ? ` (${result.error})` : '';

      reportLines.push(`- ${result.label}: ${emoji}${errorText}`);

      if (result.passed) {
        results.passed.push(result.label);
      } else {
        results.failed.push({
          label: result.label,
          error: result.error || 'No error message provided'
        });
      }
    } catch (err) {
      console.error(`❌ Error running check ${file} on ${gameDir}:`, err.message);

      // Catch fatal errors within the module itself
      const label = check.id || file;
      reportLines.push(`- ${label}: ⚠️ Error (${err.message})`);
      results.failed.push({
        label: label,
        error: err.message
      });
    }
  }

  return { reportLines, results };
}

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
  const allCheckTypes = new Set();
  const failedGames = [];
  const skippedGames = [];

  for (const gameDir of gamesToProcess) {
    const gameInfo = getGameMetadata(gameDir);
    const metadataPath = path.join(gamesDir, gameDir, 'metadata.md');

    // Skip games that are not beta or stable
    if (gameInfo && gameInfo.release && !['beta', 'stable'].includes(gameInfo.release)) {
      skippedGames.push({
        name: gameDir,
        reason: `Release status: ${gameInfo.release}`,
      });
      if (target !== '.') {
        console.log(`⏭️  Skipped ${gameDir} (Release: ${gameInfo.release})`);
      }
      continue;
    }

    if (gameInfo && fs.existsSync(metadataPath)) {
      let content = fs.readFileSync(metadataPath, 'utf8');
      const gameFolderPath = path.join(gamesDir, gameDir);

      // 1. Run all modular checks
      const { reportLines, results } = runAllChecks(gameInfo, gameDir, gameFolderPath);
      const newReportLines = reportLines.join('\n');

      // Track check types
      results.passed.forEach(check => allCheckTypes.add(check));
      results.failed.forEach(check => allCheckTypes.add(check.label));

      // Track failed games
      if (results.failed.length > 0) {
        failedGames.push({
          name: gameDir,
          path: `src/games/${gameDir}/metadata.md`,
          failedChecks: results.failed,
        });
      }

      // 2. Update the Report section dynamically
      const reportSectionRegex = /### Report\n\n([\s\S]*)$/;

      if (reportSectionRegex.test(content)) {
        // Replace everything after "### Report\n\n"
        content = content.replace(reportSectionRegex, `### Report\n\n${newReportLines}\n`);
      } else {
        // Fallback if the header is missing entirely
        content += `\n### Report\n\n${newReportLines}\n`;
      }

      fs.writeFileSync(metadataPath, content, 'utf8');

      if (target !== '.') {
        console.log(`✅ ${gameDir} report updated.`);
      }
      updatedCount++;
    } else {
      // Track games missing required files
      const reason = !gameInfo
        ? 'Missing or invalid game-info.json'
        : 'Missing metadata.md';

      skippedGames.push({
        name: gameDir,
        reason: reason,
      });

      if (target !== '.') {
        console.log(`⏭️  Skipped ${gameDir} (${reason})`);
      }
    }
  }

  console.log(`\n✨ Report completed for ${updatedCount} game(s).\n`);

  // Display summary
  console.log('====================================');
  console.log('📋 REPORT SUMMARY');
  console.log('====================================');

  if (skippedGames.length > 0) {
    console.log(`\n⏭️  Skipped Games (${skippedGames.length}):`);
    skippedGames.forEach(game => {
      console.log(`   - ${game.name}: ${game.reason}`);
    });
  }

  console.log(`\n🔍 Report Types Run (${allCheckTypes.size}):`);
  Array.from(allCheckTypes).sort().forEach(check => {
    console.log(`   - ${check}`);
  });

  if (failedGames.length > 0) {
    console.log(`\n❌ Failed Games (${failedGames.length}):`);
    failedGames.forEach(game => {
      console.log(`\n   ${game.name}`);
      console.log(`   Path: ${game.path}`);
      console.log(`   Failed checks:`);
      game.failedChecks.forEach(check => {
        console.log(`      - ${check.label}: ${check.error}`);
      });
    });
  } else {
    console.log('\n✅ All games passed all checks!');
  }

  console.log('\n====================================\n');
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
