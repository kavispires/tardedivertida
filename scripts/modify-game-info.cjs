#!/usr/bin/env node
/**
 * Script to modify properties in game-info.json files across multiple games
 *
 * This script allows you to bulk update properties in game-info.json files for
 * selected games. Supports single game, multiple games, or all games at once.
 *
 * Usage:
 *   yarn modify-game-info              (interactive mode)
 *   node scripts/modify-game-info.cjs  (interactive mode)
 *   node scripts/modify-game-info.cjs --dry-run  (preview changes without writing)
 *
 * Supported properties:
 *   - available (boolean)
 *   - release (enum: dev, beta, stable, planned, deprecated, paused)
 *   - videoBackground (boolean, nested under appearance)
 *   - imageBackground (boolean, nested under appearance)
 *   - features (array: add/remove items)
 *   - mechanics (array: add/remove items)
 */

const { execSync } = require('child_process');
const path = require('path');

const {
  colors,
  prompt,
  closeReadlineInterface,
  getValidGames,
  getGameMetadata,
  updateGameInfo,
} = require('./shared-utils.cjs');

// Check for --dry-run flag
const isDryRun = process.argv.includes('--dry-run');

// -----------------------------------------------------------------------------
// Constants from schema
// -----------------------------------------------------------------------------

const RELEASE_OPTIONS = ['dev', 'beta', 'stable', 'planned', 'cancelled', 'deprecated', 'paused'];

const FEATURES_OPTIONS = [
  'achievements',
  'audience',
  'bots',
  'mobile-friendly',
  'player-drop',
  'sound-effects',
];

const MECHANICS_OPTIONS = [
  'competitive',
  'cooperative',
  'same-time',
  'turn-based',
  'drawing',
  'writing',
  'guessing',
  'voting',
  'pairing',
  'push-your-luck',
  'brain-burner',
  'discussion',
  'puzzle',
  'timed',
  'images',
  'betting',
  'traitor',
];

// -----------------------------------------------------------------------------
// Game Selection
// -----------------------------------------------------------------------------

/**
 * Prompt user to select games to modify
 * @returns {Promise<string[]>} Array of selected game directory names
 */
async function selectGames() {
  const allGames = getValidGames();
  console.log(`\n${colors.bright}📦 Found ${allGames.length} games${colors.reset}\n`);

  console.log('How would you like to select games?\n');
  console.log('  1. All games');
  console.log('  2. Select multiple games (numbered list)');
  console.log('  3. Enter game names manually\n');

  const choice = await prompt('Enter your choice (1-3): ');

  switch (choice) {
    case '1':
      console.log(`\n${colors.green}✓ Selected all ${allGames.length} games${colors.reset}`);
      return allGames;

    case '2':
      return await selectGamesFromList(allGames);

    case '3':
      return await selectGamesManually(allGames);

    default:
      console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
      process.exit(1);
  }
}

/**
 * Select games from a numbered list
 * @param {string[]} allGames - All available games
 * @returns {Promise<string[]>}
 */
async function selectGamesFromList(allGames) {
  console.log(`\n${colors.bright}Select games (enter numbers separated by commas):${colors.reset}\n`);

  // Display numbered list in columns
  const columns = 3;
  for (let i = 0; i < allGames.length; i += columns) {
    const row = allGames
      .slice(i, i + columns)
      .map((game, idx) => {
        const num = i + idx + 1;
        return `${num.toString().padStart(2)}. ${game.padEnd(30)}`;
      })
      .join('  ');
    console.log(row);
  }

  const input = await prompt('\nEnter numbers (e.g., 1,3,5-8,12): ');
  const selected = parseNumberSelection(input, allGames.length);

  if (selected.length === 0) {
    console.log(`${colors.red}❌ No valid games selected${colors.reset}`);
    process.exit(1);
  }

  const gameNames = selected.map((idx) => allGames[idx - 1]);
  console.log(
    `\n${colors.green}✓ Selected ${gameNames.length} games${colors.reset}: ${gameNames.join(', ')}`
  );
  return gameNames;
}

/**
 * Parse number selection input (supports ranges like "1,3,5-8,12")
 * @param {string} input - User input
 * @param {number} max - Maximum valid number
 * @returns {number[]} Array of selected numbers
 */
function parseNumberSelection(input, max) {
  const numbers = new Set();
  const parts = input.split(',').map((s) => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      // Range like "5-8"
      const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start > 0 && end <= max && start <= end) {
        for (let i = start; i <= end; i++) {
          numbers.add(i);
        }
      }
    } else {
      // Single number
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > 0 && num <= max) {
        numbers.add(num);
      }
    }
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Enter game names manually
 * @param {string[]} allGames - All available games for validation
 * @returns {Promise<string[]>}
 */
async function selectGamesManually(allGames) {
  const input = await prompt(
    '\nEnter game names (comma-separated, e.g., arte-ruim,bomba-relogio): '
  );
  const gameNames = input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s);

  // Validate all game names exist
  const invalid = gameNames.filter((name) => !allGames.includes(name));
  if (invalid.length > 0) {
    console.log(`${colors.red}❌ Invalid game names: ${invalid.join(', ')}${colors.reset}`);
    console.log(`${colors.yellow}Available games: ${allGames.join(', ')}${colors.reset}`);
    process.exit(1);
  }

  if (gameNames.length === 0) {
    console.log(`${colors.red}❌ No games selected${colors.reset}`);
    process.exit(1);
  }

  console.log(`\n${colors.green}✓ Selected ${gameNames.length} games${colors.reset}`);
  return gameNames;
}

// -----------------------------------------------------------------------------
// Property Selection & Modification
// -----------------------------------------------------------------------------

/**
 * Prompt user to select which property to modify
 * @returns {Promise<{property: string, path: string, handler: Function}>}
 */
async function selectProperty() {
  console.log(`\n${colors.bright}📝 Select property to modify:${colors.reset}\n`);
  console.log('  1. available (boolean)');
  console.log('  2. release (status)');
  console.log('  3. videoBackground (boolean)');
  console.log('  4. imageBackground (boolean)');
  console.log('  5. features (array - add/remove)');
  console.log('  6. mechanics (array - add/remove)\n');

  const choice = await prompt('Enter your choice (1-6): ');

  switch (choice) {
    case '1':
      return {
        property: 'available',
        path: 'available',
        handler: handleBooleanProperty,
      };
    case '2':
      return {
        property: 'release',
        path: 'release',
        handler: handleReleaseProperty,
      };
    case '3':
      return {
        property: 'videoBackground',
        path: 'appearance.videoBackground',
        handler: handleBooleanProperty,
      };
    case '4':
      return {
        property: 'imageBackground',
        path: 'appearance.imageBackground',
        handler: handleBooleanProperty,
      };
    case '5':
      return {
        property: 'features',
        path: 'features',
        handler: handleFeaturesProperty,
      };
    case '6':
      return {
        property: 'mechanics',
        path: 'mechanics',
        handler: handleMechanicsProperty,
      };
    default:
      console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
      process.exit(1);
  }
}

/**
 * Handle boolean property modification
 * @returns {Promise<boolean>}
 */
async function handleBooleanProperty() {
  console.log(`\n${colors.bright}Set value:${colors.reset}\n`);
  console.log('  1. true');
  console.log('  2. false\n');

  const choice = await prompt('Enter your choice (1-2): ');

  switch (choice) {
    case '1':
      return true;
    case '2':
      return false;
    default:
      console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
      process.exit(1);
  }
}

/**
 * Handle release property modification
 * @returns {Promise<string>}
 */
async function handleReleaseProperty() {
  console.log(`\n${colors.bright}Select release status:${colors.reset}\n`);
  RELEASE_OPTIONS.forEach((option, idx) => {
    console.log(`  ${idx + 1}. ${option}`);
  });
  console.log();

  const choice = await prompt(`Enter your choice (1-${RELEASE_OPTIONS.length}): `);
  const idx = parseInt(choice, 10) - 1;

  if (idx >= 0 && idx < RELEASE_OPTIONS.length) {
    return RELEASE_OPTIONS[idx];
  }

  console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
  process.exit(1);
}

/**
 * Handle features array modification
 * @returns {Promise<string[]>}
 */
async function handleFeaturesProperty() {
  console.log(`\n${colors.bright}Modify features array:${colors.reset}\n`);
  console.log('  1. Set specific features (replace entire array)');
  console.log('  2. Add a feature');
  console.log('  3. Remove a feature\n');

  const choice = await prompt('Enter your choice (1-3): ');

  switch (choice) {
    case '1':
      return await selectMultipleFromList(FEATURES_OPTIONS, 'features');
    case '2':
      return { operation: 'add', value: await selectSingleFromList(FEATURES_OPTIONS, 'feature') };
    case '3':
      return {
        operation: 'remove',
        value: await selectSingleFromList(FEATURES_OPTIONS, 'feature'),
      };
    default:
      console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
      process.exit(1);
  }
}

/**
 * Handle mechanics array modification
 * @returns {Promise<string[]>}
 */
async function handleMechanicsProperty() {
  console.log(`\n${colors.bright}Modify mechanics array:${colors.reset}\n`);
  console.log('  1. Set specific mechanics (replace entire array)');
  console.log('  2. Add a mechanic');
  console.log('  3. Remove a mechanic\n');

  const choice = await prompt('Enter your choice (1-3): ');

  switch (choice) {
    case '1':
      return await selectMultipleFromList(MECHANICS_OPTIONS, 'mechanics');
    case '2':
      return {
        operation: 'add',
        value: await selectSingleFromList(MECHANICS_OPTIONS, 'mechanic'),
      };
    case '3':
      return {
        operation: 'remove',
        value: await selectSingleFromList(MECHANICS_OPTIONS, 'mechanic'),
      };
    default:
      console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
      process.exit(1);
  }
}

/**
 * Select multiple items from a list
 * @param {string[]} options - Available options
 * @param {string} label - Label for display
 * @returns {Promise<string[]>}
 */
async function selectMultipleFromList(options, label) {
  console.log(`\n${colors.bright}Select ${label} (enter numbers separated by commas):${colors.reset}\n`);
  options.forEach((option, idx) => {
    console.log(`  ${idx + 1}. ${option}`);
  });
  console.log();

  const input = await prompt('Enter numbers (e.g., 1,3,5): ');
  const selected = parseNumberSelection(input, options.length);

  if (selected.length === 0) {
    console.log(`${colors.yellow}⚠️  No items selected, array will be empty${colors.reset}`);
    return [];
  }

  return selected.map((idx) => options[idx - 1]);
}

/**
 * Select a single item from a list
 * @param {string[]} options - Available options
 * @param {string} label - Label for display
 * @returns {Promise<string>}
 */
async function selectSingleFromList(options, label) {
  console.log(`\n${colors.bright}Select ${label}:${colors.reset}\n`);
  options.forEach((option, idx) => {
    console.log(`  ${idx + 1}. ${option}`);
  });
  console.log();

  const choice = await prompt(`Enter your choice (1-${options.length}): `);
  const idx = parseInt(choice, 10) - 1;

  if (idx >= 0 && idx < options.length) {
    return options[idx];
  }

  console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Apply Modifications
// -----------------------------------------------------------------------------

/**
 * Apply modifications to all selected games
 * @param {string[]} games - Selected game names
 * @param {Object} propertyConfig - Property configuration
 * @param {any} newValue - New value to set
 * @returns {Promise<string[]>} Array of successfully modified game names
 */
async function applyModifications(games, propertyConfig, newValue) {
  console.log(
    `\n${colors.bright}${isDryRun ? '🔍 DRY RUN - Preview Changes' : '🔧 Applying Changes'}${colors.reset}\n`
  );

  const results = [];

  for (const game of games) {
    const gameInfo = getGameMetadata(game);
    if (!gameInfo) {
      results.push({
        game,
        success: false,
        error: 'Failed to read game-info.json',
      });
      continue;
    }

    // Get current value
    const currentValue = getCurrentValue(gameInfo, propertyConfig.path);

    // Compute final value (handle array operations)
    let finalValue = newValue;
    if (
      typeof newValue === 'object' &&
      newValue !== null &&
      newValue.operation &&
      Array.isArray(currentValue)
    ) {
      if (newValue.operation === 'add') {
        finalValue = currentValue.includes(newValue.value)
          ? currentValue
          : [...currentValue, newValue.value];
      } else if (newValue.operation === 'remove') {
        finalValue = currentValue.filter((item) => item !== newValue.value);
      }
    }

    // Skip if no change
    if (JSON.stringify(currentValue) === JSON.stringify(finalValue)) {
      results.push({
        game,
        success: true,
        skipped: true,
        before: currentValue,
        after: finalValue,
      });
      continue;
    }

    // Apply update
    const result = updateGameInfo(game, { [propertyConfig.path]: finalValue }, isDryRun);

    results.push({
      game,
      success: result.success,
      before: currentValue,
      after: finalValue,
      error: result.error,
    });
  }

  // Display results
  displayResults(results, propertyConfig.property);

  // Return list of successfully modified games
  return results.filter((r) => r.success && !r.skipped).map((r) => r.game);
}

/**
 * Get current value from gameInfo using dot notation path
 * @param {Object} gameInfo - Game metadata
 * @param {string} path - Dot notation path (e.g., "appearance.videoBackground")
 * @returns {any}
 */
function getCurrentValue(gameInfo, path) {
  const keys = path.split('.');
  let value = gameInfo;
  for (const key of keys) {
    value = value?.[key];
  }
  return value;
}

/**
 * Display results summary
 * @param {Array} results - Results from all modifications
 * @param {string} propertyName - Property name being modified
 */
function displayResults(results, propertyName) {
  const successful = results.filter((r) => r.success && !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  const failed = results.filter((r) => !r.success);

  console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}Results Summary${colors.reset}`);
  console.log(`${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (successful.length > 0) {
    console.log(
      `${colors.green}✓ ${successful.length} game(s) ${isDryRun ? 'would be modified' : 'modified'}:${colors.reset}\n`
    );
    successful.forEach((r) => {
      const beforeStr = formatValue(r.before);
      const afterStr = formatValue(r.after);
      console.log(
        `  ${colors.dim}${r.game.padEnd(30)}${colors.reset} ${beforeStr} ${colors.dim}→${colors.reset} ${afterStr}`
      );
    });
    console.log();
  }

  if (skipped.length > 0) {
    console.log(`${colors.yellow}⊘ ${skipped.length} game(s) skipped (no change):${colors.reset}\n`);
    skipped.forEach((r) => {
      const valueStr = formatValue(r.before);
      console.log(`  ${colors.dim}${r.game.padEnd(30)}${colors.reset} ${valueStr}`);
    });
    console.log();
  }

  if (failed.length > 0) {
    console.log(`${colors.red}✗ ${failed.length} game(s) failed:${colors.reset}\n`);
    failed.forEach((r) => {
      console.log(`  ${colors.red}${r.game.padEnd(30)}${colors.reset} ${r.error}`);
    });
    console.log();
  }

  // Summary stats
  console.log(`${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(
    `${colors.bright}Total:${colors.reset} ${results.length} games | ` +
      `${colors.green}Modified: ${successful.length}${colors.reset} | ` +
      `${colors.yellow}Skipped: ${skipped.length}${colors.reset} | ` +
      `${colors.red}Failed: ${failed.length}${colors.reset}`
  );
  console.log(`${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (isDryRun) {
    console.log(
      `${colors.cyan}ℹ️  This was a dry run. No files were modified. Run without --dry-run to apply changes.${colors.reset}\n`
    );
  } else if (successful.length > 0) {
    console.log(`${colors.green}✅ Changes applied successfully!${colors.reset}\n`);
  }
}

/**
 * Format value for display
 * @param {any} value
 * @returns {string}
 */
function formatValue(value) {
  if (typeof value === 'boolean') {
    return value ? `${colors.green}true${colors.reset}` : `${colors.red}false${colors.reset}`;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? `[${value.join(', ')}]` : `${colors.dim}[]${colors.reset}`;
  }
  return `${colors.cyan}${value}${colors.reset}`;
}

/**
 * Stage modified game-info.json files with git
 * @param {string[]} games - List of game names that were modified
 */
function stageModifiedFiles(games) {
  if (games.length === 0) {
    return;
  }

  console.log(`\n${colors.bright}📦 Staging files with git...${colors.reset}\n`);

  const filePaths = games.map((game) => `src/games/${game}/game-info.json`);

  try {
    // Stage each file
    for (const filePath of filePaths) {
      execSync(`git add ${filePath}`, { stdio: 'pipe' });
      console.log(`  ${colors.green}✓${colors.reset} ${filePath}`);
    }

    console.log(`\n${colors.green}✅ Staged ${games.length} file(s) successfully${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.red}❌ Error staging files: ${error.message}${colors.reset}\n`);
  }
}

// -----------------------------------------------------------------------------
// Main Execution
// -----------------------------------------------------------------------------

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}   Bulk Game-Info Modifier${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  if (isDryRun) {
    console.log(`\n${colors.yellow}🔍 DRY RUN MODE - No files will be modified${colors.reset}`);
  }

  try {
    // Step 1: Select games
    const selectedGames = await selectGames();

    // Step 2: Select property to modify
    const propertyConfig = await selectProperty();

    // Step 3: Get new value
    const newValue = await propertyConfig.handler();

    // Step 4: Confirm
    console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bright}Confirmation${colors.reset}`);
    console.log(`${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    console.log(`  Games:    ${colors.cyan}${selectedGames.length} selected${colors.reset}`);
    console.log(`  Property: ${colors.cyan}${propertyConfig.property}${colors.reset}`);
    console.log(`  New value: ${formatValue(newValue)}`);
    console.log();

    const confirm = await prompt(`${colors.yellow}Continue? (y/N):${colors.reset} `);
    if (confirm.toLowerCase() !== 'y') {
      console.log(`\n${colors.yellow}❌ Operation cancelled${colors.reset}\n`);
      closeReadlineInterface();
      process.exit(0);
    }

    // Step 5: Apply modifications
    const modifiedGames = await applyModifications(selectedGames, propertyConfig, newValue);

    // Step 6: Ask about staging (only if not dry-run and files were modified)
    if (!isDryRun && modifiedGames.length > 0) {
      const shouldStage = await prompt(
        `${colors.yellow}Stage modified game-info.json files with git? (y/N):${colors.reset} `
      );

      if (shouldStage.toLowerCase() === 'y') {
        stageModifiedFiles(modifiedGames);
      } else {
        console.log(`\n${colors.dim}Files not staged${colors.reset}\n`);
      }
    }

    closeReadlineInterface();
  } catch (error) {
    console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}\n`);
    closeReadlineInterface();
    process.exit(1);
  }
}

// Run the script
main();
