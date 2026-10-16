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
 *   ✅ Staged: functions/src/games/bomba-relogio src/games/bomba-relogio
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ROOT = path.resolve(__dirname, '..');

let rl;

/**
 * Prompts the user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} The user's answer
 */
function prompt(question) {
  rl ??= readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Execute a git command and return the output
 * @param {string[]} args - Arguments passed directly to Git
 * @returns {string} Unmodified command output
 */
function gitCommand(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf-8',
    stdio: 'pipe',
  });
}

/**
 * Reads destination and original paths from NUL-delimited porcelain status records.
 * @param {string} output - Git status output with its status columns intact
 * @returns {string[]} Changed paths, including both sides of renames and copies
 */
function parseStatusPaths(output) {
  const records = output.split('\0');
  const paths = [];
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    if (!record) continue;
    paths.push(record.slice(3));
    if (/[RC]/.test(record.slice(0, 2))) {
      const original = records[++index];
      if (!original) throw new Error('Git status returned a rename or copy without its original path');
      paths.push(original);
    }
  }
  return paths;
}

/**
 * Get list of games with modified files
 * @returns {string[]} Array of unique game names
 */
function getModifiedGames() {
  const games = new Set();
  const paths = parseStatusPaths(gitCommand(['status', '--porcelain=v1', '-z', '--untracked-files=all']));

  for (const filePath of paths) {
    // Check if it's a game file in either location
    const backendMatch = filePath.match(/^functions\/src\/games\/([a-z-]+)\//);
    const frontendMatch = filePath.match(/^src\/games\/([a-z-]+)\//);

    if (backendMatch) {
      games.add(backendMatch[1]);
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
 * Finds game directories that exist or still contain tracked files pending deletion.
 * @param {string} gameName - Validated game slug
 * @returns {string[]} Repository-relative paths that Git can stage
 */
function getGamePaths(gameName) {
  return [`functions/src/games/${gameName}`, `src/games/${gameName}`].filter(candidate =>
    directoryExists(path.join(ROOT, candidate)) ||
    gitCommand(['ls-files', '-z', '--', candidate]).length > 0
  );
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
      rl?.close();
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
      rl?.close();
      process.exit(1);
    }
  }

  if (!validateGameName(gameName)) {
    console.error(
      '❌ Error: Invalid game name format. Use lowercase letters with hyphens (e.g., bomba-relogio)'
    );
    rl?.close();
    process.exit(1);
  }

  // Define paths
  const backendPath = path.resolve(__dirname, `../functions/src/games/${gameName}`);
  const frontendPath = path.resolve(__dirname, `../src/games/${gameName}`);

  // Check if directories exist
  const backendExists = directoryExists(backendPath);
  const frontendExists = directoryExists(frontendPath);

  const pathsToStage = getGamePaths(gameName);
  if (pathsToStage.length === 0) {
    console.error(`❌ Error: Game "${gameName}" not found in either location:`);
    console.error(`   - functions/src/games/${gameName}`);
    console.error(`   - src/games/${gameName}`);
    rl?.close();
    process.exit(1);
  }

  // Warn if only one path exists
  if (!backendExists) {
    console.warn(`⚠️  Warning: Backend not found at functions/src/games/${gameName}`);
  }
  if (!frontendExists) {
    console.warn(`⚠️  Warning: Frontend not found at src/games/${gameName}`);
  }

  try {
    execFileSync('git', ['add', '--', ...pathsToStage], { cwd: ROOT, stdio: 'inherit' });
    console.log(`\n✅ Staged: ${pathsToStage.join(' ')}`);
  } catch (error) {
    console.error('\n❌ Error: Failed to stage files');
    console.error(error.message);
    rl?.close();
    process.exit(1);
  }

  rl?.close();
}

module.exports = { parseStatusPaths, getModifiedGames, getGamePaths, main };

if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Error:', error.message);
    rl?.close();
    process.exitCode = 1;
  });
}
