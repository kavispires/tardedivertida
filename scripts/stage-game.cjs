#!/usr/bin/env node
/**
 * Script to stage game files for git commit
 *
 * This script detects modified games and allows you to select which game to stage,
 * or manually enter a game name. It stages both the frontend and backend files for
 * the selected game using git add.
 *
 * Usage:
 *   yarn stage-game
 *   node scripts/stage-game.cjs
 *
 * Example:
 *   Select a game or enter manually:
 *   1. bomba-relogio
 *   2. arte-ruim
 *   Enter selection (1-2) or game name: 1
 *   ✅ Staged: functions/src/engine/bomba-relogio src/games/bomba-relogio
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
 * Execute a git command and return the output
 * @param {string} command - Git command to execute
 * @returns {string|null} Command output or null on error
 */
function gitCommand(command) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Get list of games with modified files
 * @returns {string[]} Array of unique game names
 */
function getModifiedGames() {
  const output = gitCommand('git status --short');
  if (!output) return [];

  const games = new Set();
  const lines = output.split('\n').filter(Boolean);

  for (const line of lines) {
    // Extract file path (everything after status markers)
    const filePath = line.replace(/^.../, '').trim();

    // Check if it's a game file in either location
    const engineMatch = filePath.match(/^functions\/src\/engine\/([a-z-]+)\//);
    const frontendMatch = filePath.match(/^src\/games\/([a-z-]+)\//);

    if (engineMatch) {
      games.add(engineMatch[1]);
    } else if (frontendMatch) {
      games.add(frontendMatch[1]);
    }
  }

  return Array.from(games).sort();
}

/**
 * Validates game name format (lowercase with optional hyphens)
 * @param {string} name - The game name to validate
 * @returns {boolean} Whether the name is valid
 */
function validateGameName(name) {
  const regex = /^[a-z]+(-[a-z]+)*$/;
  return regex.test(name);
}

/**
 * Checks if a directory exists
 * @param {string} dirPath - Path to check
 * @returns {boolean} Whether the directory exists
 */
function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Main function
 */
async function main() {
  console.log('🎮 Stage Game Files for Git\n');

  // Get modified games
  const modifiedGames = getModifiedGames();

  let gameName = '';

  if (modifiedGames.length > 0) {
    console.log('Modified games detected:\n');
    modifiedGames.forEach((game, index) => {
      console.log(`  ${index + 1}. ${game}`);
    });
    console.log('');

    const selection = await prompt(
      `Select game (1-${modifiedGames.length}) or enter game name manually: `
    );

    if (!selection) {
      console.error('❌ Error: Selection cannot be empty');
      rl.close();
      process.exit(1);
    }

    // Check if it's a number selection
    const selectionNum = parseInt(selection, 10);
    if (!isNaN(selectionNum) && selectionNum >= 1 && selectionNum <= modifiedGames.length) {
      gameName = modifiedGames[selectionNum - 1];
      console.log(`Selected: ${gameName}\n`);
    } else {
      // Treat as manual entry
      gameName = selection;
    }
  } else {
    console.log('No modified games detected.\n');
    gameName = await prompt('Enter game name (e.g., bomba-relogio): ');

    if (!gameName) {
      console.error('❌ Error: Game name cannot be empty');
      rl.close();
      process.exit(1);
    }
  }

  if (!validateGameName(gameName)) {
    console.error(
      '❌ Error: Invalid game name format. Use lowercase letters with hyphens (e.g., bomba-relogio)'
    );
    rl.close();
    process.exit(1);
  }

  // Define paths
  const enginePath = path.resolve(__dirname, `../functions/src/engine/${gameName}`);
  const frontendPath = path.resolve(__dirname, `../src/games/${gameName}`);

  // Check if directories exist
  const engineExists = directoryExists(enginePath);
  const frontendExists = directoryExists(frontendPath);

  if (!engineExists && !frontendExists) {
    console.error(`❌ Error: Game "${gameName}" not found in either location:`);
    console.error(`   - functions/src/engine/${gameName}`);
    console.error(`   - src/games/${gameName}`);
    rl.close();
    process.exit(1);
  }

  // Warn if only one path exists
  if (!engineExists) {
    console.warn(`⚠️  Warning: Backend not found at functions/src/engine/${gameName}`);
  }
  if (!frontendExists) {
    console.warn(`⚠️  Warning: Frontend not found at src/games/${gameName}`);
  }

  // Stage the files
  const pathsToStage = `functions/src/engine/${gameName} src/games/${gameName}`;

  try {
    execSync(`git add ${pathsToStage}`, { stdio: 'inherit' });
    console.log(`\n✅ Staged: ${pathsToStage}`);
  } catch (error) {
    console.error('\n❌ Error: Failed to stage files');
    console.error(error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

main();
