/**
 * Shared utility functions for scripts
 *
 * This module provides reusable utilities to avoid code duplication across scripts.
 * Includes functions for game discovery, validation, prompts, and file operations.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// -----------------------------------------------------------------------------
// Color Constants
// -----------------------------------------------------------------------------

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// -----------------------------------------------------------------------------
// Readline Interface
// -----------------------------------------------------------------------------

let rlInstance = null;

/**
 * Get or create readline interface
 * @returns {readline.Interface}
 */
function getReadlineInterface() {
  if (!rlInstance) {
    rlInstance = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  return rlInstance;
}

/**
 * Close readline interface
 */
function closeReadlineInterface() {
  if (rlInstance) {
    rlInstance.close();
    rlInstance = null;
  }
}

// -----------------------------------------------------------------------------
// Prompt Functions
// -----------------------------------------------------------------------------

/**
 * Prompts the user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} The user's answer (trimmed)
 */
function prompt(question) {
  const rl = getReadlineInterface();
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// -----------------------------------------------------------------------------
// Game Discovery Functions
// -----------------------------------------------------------------------------

/**
 * Get list of all valid game directories (excluding _template)
 * @returns {string[]} Array of game directory names
 */
function getValidGames() {
  const gamesDir = path.resolve(__dirname, '../src/games');
  if (!fs.existsSync(gamesDir)) {
    console.error(`${colors.red}❌ Games directory not found at: ${gamesDir}${colors.reset}`);
    process.exit(1);
  }

  return fs.readdirSync(gamesDir)
    .filter((dir) => {
      const fullPath = path.join(gamesDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir !== '_template';
    })
    .sort();
}

/**
 * Get game metadata from game-info.json
 * @param {string} gameDir - The game directory name
 * @returns {Object|null} Parsed game-info.json or null if not found/invalid
 */
function getGameMetadata(gameDir) {
  const gamesDir = path.resolve(__dirname, '../src/games');
  const gameInfoPath = path.join(gamesDir, gameDir, 'game-info.json');

  if (!fs.existsSync(gameInfoPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(gameInfoPath, 'utf8'));
  } catch (e) {
    console.error(
      `${colors.yellow}⚠️  Warning: Failed to parse game-info.json for ${gameDir}${colors.reset}`
    );
    return null;
  }
}

/**
 * Get path to game-info.json for a game
 * @param {string} gameDir - The game directory name
 * @returns {string} Full path to game-info.json
 */
function getGameInfoPath(gameDir) {
  const gamesDir = path.resolve(__dirname, '../src/games');
  return path.join(gamesDir, gameDir, 'game-info.json');
}

// -----------------------------------------------------------------------------
// Validation Functions
// -----------------------------------------------------------------------------

/**
 * Validates game name format (lowercase with optional hyphens)
 * @param {string} name - The game name to validate
 * @returns {boolean} Whether the name is valid
 */
function validateGameName(name) {
  const regex = /^[a-z]+(-[a-z]+)*$/;
  return regex.test(name);
}

// -----------------------------------------------------------------------------
// JSON File Operations
// -----------------------------------------------------------------------------

/**
 * Read and parse a JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Object|null} Parsed JSON or null on error
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Write JSON to file with proper formatting (2-space indent + trailing newline)
 * @param {string} filePath - Path to JSON file
 * @param {Object} data - Data to write
 * @returns {boolean} Success status
 */
function writeJsonFile(filePath, data) {
  try {
    const content = JSON.stringify(data, null, 2) + '\n';
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Failed to write ${filePath}: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Safely update a game-info.json file with new property values
 * @param {string} gameDir - The game directory name
 * @param {Object} updates - Key-value pairs to update (supports nested paths with dot notation)
 * @param {boolean} dryRun - If true, don't actually write the file
 * @returns {{success: boolean, before: any, after: any, error?: string}}
 */
function updateGameInfo(gameDir, updates, dryRun = false) {
  const gameInfoPath = getGameInfoPath(gameDir);
  const gameInfo = readJsonFile(gameInfoPath);

  if (!gameInfo) {
    return {
      success: false,
      before: null,
      after: null,
      error: 'Failed to read game-info.json',
    };
  }

  const result = {
    success: true,
    before: {},
    after: {},
  };

  // Apply updates
  const updatedGameInfo = JSON.parse(JSON.stringify(gameInfo)); // Deep clone

  for (const [key, value] of Object.entries(updates)) {
    // Support nested properties with dot notation (e.g., "appearance.videoBackground")
    const keys = key.split('.');
    let current = updatedGameInfo;
    let beforeCurrent = gameInfo;

    // Navigate to nested property
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
      beforeCurrent = beforeCurrent[keys[i]] || {};
    }

    const finalKey = keys[keys.length - 1];
    result.before[key] = beforeCurrent[finalKey];
    result.after[key] = value;
    current[finalKey] = value;
  }

  // Write file unless dry run
  if (!dryRun) {
    const writeSuccess = writeJsonFile(gameInfoPath, updatedGameInfo);
    if (!writeSuccess) {
      result.success = false;
      result.error = 'Failed to write file';
    }
  }

  return result;
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
  colors,
  prompt,
  getReadlineInterface,
  closeReadlineInterface,
  getValidGames,
  getGameMetadata,
  getGameInfoPath,
  validateGameName,
  readJsonFile,
  writeJsonFile,
  updateGameInfo,
};
