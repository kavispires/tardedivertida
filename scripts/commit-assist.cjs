#!/usr/bin/env node
/**
 * Script to assist with commit message formatting
 *
 * This script helps you create well-formatted commit messages with scope prefixes.
 * It analyzes staged files to suggest relevant scopes (games, areas) and constructs
 * a commit message in the format: [scope] message
 *
 * Usage:
 *   yarn commit
 *   node scripts/commit-assist.cjs
 *
 * Example:
 *   Enter your commit message: Migrated game to achievements tool-kit
 *   Select scope:
 *   1. megamix (game)
 *   2. daily
 *   3. functions
 *   ...
 *   Enter selection (1-12), custom scope, or leave blank: 1
 *   ✅ Committing: [megamix] Migrated game to achievements tool-kit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const HISTORY_FILE = path.join(__dirname, '.commit-history.json');
const MAX_HISTORY = 3;

/**
 * Prompts the user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} The user's answer
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Load commit message history
 * @returns {string[]} Array of previous commit messages
 */
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    // Ignore errors, return empty array
  }
  return [];
}

/**
 * Save commit message to history
 * @param {string} message - The commit message to save
 */
function saveToHistory(message) {
  try {
    const history = loadHistory();
    // Remove if already exists to avoid duplicates
    const filtered = history.filter(m => m !== message);
    // Add to beginning
    filtered.unshift(message);
    // Keep only last MAX_HISTORY items
    const limited = filtered.slice(0, MAX_HISTORY);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(limited, null, 2));
  } catch (error) {
    // Ignore save errors
  }
}

/**
 * Execute a git command and return the output
 * @param {string} command - Git command to execute
 * @returns {string|null} Command output or null on error
 */
function gitCommand(command) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Get list of staged files
 * @returns {string[]} Array of file paths
 */
function getStagedFiles() {
  const output = gitCommand('git diff --cached --name-only');
  if (!output) return [];
  return output.split('\n').filter(Boolean);
}

/**
 * Analyze staged files to determine possible scopes
 * @param {string[]} files - Array of file paths
 * @returns {object} Object with games and areas arrays
 */
function analyzeStagedFiles(files) {
  const games = new Set();
  const areas = new Set();

  for (const file of files) {
    // Check for games
    const engineMatch = file.match(/^functions\/src\/engine\/([a-z-]+)\//);
    const frontendGameMatch = file.match(/^src\/games\/([a-z-]+)\//);

    if (engineMatch) {
      games.add(engineMatch[1]);
    } else if (frontendGameMatch) {
      games.add(frontendGameMatch[1]);
    }

    // Check for specific areas
    if (file.startsWith('src/pages/Daily/')) {
      areas.add('daily');
    } else if (file.startsWith('functions/')) {
      areas.add('functions');
    } else if (file.startsWith('src/components/')) {
      areas.add('components');
    } else if (file.startsWith('src/pages/Hub')) {
      areas.add('hub');
    } else if (file.startsWith('src/pages/Dev')) {
      areas.add('dev');
    } else if (file.match(/^src\/(App|index|routes)/)) {
      areas.add('app');
    } else if (file.startsWith('src/icons/')) {
      areas.add('icons');
    } else if (file.startsWith('src/hooks/')) {
      areas.add('hooks');
    } else if (file.startsWith('scripts/')) {
      areas.add('scripts');
    }
  }

  return {
    games: Array.from(games).sort(),
    areas: Array.from(areas).sort(),
  };
}

/**
 * Build scope options from detected scopes
 * @param {object} scopes - Object with games and areas
 * @returns {Array<{label: string, value: string}>} Array of scope options
 */
function buildScopeOptions(scopes) {
  const options = [];

  // Add games first
  for (const game of scopes.games) {
    options.push({ label: `${game} (game)`, value: game });
  }

  // Add detected areas
  for (const area of scopes.areas) {
    options.push({ label: area, value: area });
  }

  // Add generic options that weren't detected
  const genericOptions = [
    'app',
    'components',
    'daily',
    'dev',
    'functions',
    'hub',
    'icons',
    'hooks',
    'scripts',
  ];

  for (const generic of genericOptions) {
    if (!scopes.areas.includes(generic)) {
      options.push({ label: generic, value: generic });
    }
  }

  return options;
}

/**
 * Main function
 */
async function main() {
  console.log('📝 Commit Message Assistant\n');

  // Check if there are staged files
  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    console.error('❌ Error: No staged files found');
    console.error('   Please stage your changes first using "git add" or "yarn stage-game"');
    rl.close();
    process.exit(1);
  }

  // Load and display message history
  const history = loadHistory();
  let message = '';

  if (history.length > 0) {
    console.log('Recent commit messages:\n');
    history.forEach((msg, index) => {
      console.log(`  ${index + 1}. "${msg}"`);
    });
    console.log(`  ${history.length + 1}. (enter new message)`);
    console.log('');

    const historySelection = await prompt(
      `Select message (1-${history.length + 1}) or enter new message: `
    );

    if (!historySelection) {
      console.error('❌ Error: Selection cannot be empty');
      rl.close();
      process.exit(1);
    }

    // Check if it's a number selection
    const selectionNum = parseInt(historySelection, 10);
    if (!isNaN(selectionNum) && selectionNum >= 1 && selectionNum <= history.length) {
      message = history[selectionNum - 1];
      console.log(`Selected: "${message}"\n`);
    } else if (!isNaN(selectionNum) && selectionNum === history.length + 1) {
      // User selected "enter new message"
      message = await prompt('Enter your commit message: ');
      if (!message) {
        console.error('❌ Error: Commit message cannot be empty');
        rl.close();
        process.exit(1);
      }
    } else {
      // Treat as direct message input
      message = historySelection;
    }
  } else {
    // No history, ask directly
    message = await prompt('Enter your commit message: ');
    if (!message) {
      console.error('❌ Error: Commit message cannot be empty');
      rl.close();
      process.exit(1);
    }
  }

  // Analyze staged files
  const scopes = analyzeStagedFiles(stagedFiles);
  const scopeOptions = buildScopeOptions(scopes);

  console.log('\nSelect scope:\n');

  // Display options
  scopeOptions.forEach((option, index) => {
    console.log(`  ${index + 1}. ${option.label}`);
  });
  console.log(`  ${scopeOptions.length + 1}. (no scope - commit as is)`);
  console.log('');

  const selection = await prompt(
    `Enter selection (1-${scopeOptions.length + 1}), custom scope, or leave blank: `
  );

  let scope = '';

  if (selection) {
    // Check if it's a number selection
    const selectionNum = parseInt(selection, 10);
    if (!isNaN(selectionNum)) {
      if (selectionNum >= 1 && selectionNum <= scopeOptions.length) {
        scope = scopeOptions[selectionNum - 1].value;
      } else if (selectionNum === scopeOptions.length + 1) {
        scope = '';
      } else {
        console.error(`❌ Error: Invalid selection. Please enter 1-${scopeOptions.length + 1}`);
        rl.close();
        process.exit(1);
      }
    } else {
      // Treat as custom scope
      scope = selection;
    }
  }

  // Construct final commit message
  const finalMessage = scope ? `[${scope}] ${message}` : message;

  console.log(`\n✅ Committing: ${finalMessage}\n`);

  // Execute git commit (this will trigger pre-commit hooks)
  try {
    execSync(`git commit -m "${finalMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    console.log('\n✅ Commit successful!');
    // Save message to history only if commit succeeded
    saveToHistory(message);
  } catch (error) {
    console.error('\n❌ Commit failed');
    if (error.status) {
      // Exit with the same code as git commit
      rl.close();
      process.exit(error.status);
    }
  }

  rl.close();
}

main();
