#!/usr/bin/env node

/**
 * Game Onboarding CLI - Main entry point
 * Enhanced backend setup with file pre-population
 */

const fs = require('fs');
const path = require('path');

// Import modules
const {
  convertNameToKey,
  convertToCamelCase,
  convertToPascalCase,
  validateGameName,
  validateGameCode,
} = require('./utils.cjs');

const {
  promptForPhases,
  promptForActions,
  promptForPlayerCounts,
  promptForRounds,
  displayMetadataSummary,
} = require('./prompts.cjs');

// Import generators
const { generateConstants } = require('./generators/constants.cjs');
const { generateActions } = require('./generators/actions.cjs');
const { generateTypes } = require('./generators/types.cjs');
const { generateIndex } = require('./generators/index-file.cjs');
const { generateHelpers } = require('./generators/helpers.cjs');
const { generateSetup } = require('./generators/setup.cjs');
const { generateAchievements } = require('./generators/achievements.cjs');
const { generateData } = require('./generators/data.cjs');

/**
 * Updates the GAMES constant in functions/src/utils/constants.ts
 */
async function updateGamesConstant(gameName, gameCode) {
  const constantsPath = path.resolve(__dirname, '../../functions/src/utils/constants.ts');

  if (!fs.existsSync(constantsPath)) {
    console.error(`❌ Error: constants.ts not found at ${constantsPath}`);
    return false;
  }

  const fileContent = fs.readFileSync(constantsPath, 'utf-8');
  const gamesArrayMatch = fileContent.match(/const GAMES = \[([\s\S]*?)\];/);

  if (!gamesArrayMatch) {
    console.error('❌ Error: Could not find GAMES array in constants.ts');
    return false;
  }

  const gamesArrayContent = gamesArrayMatch[1];
  const existingGamesMatches = [...gamesArrayContent.matchAll(/name: '([^']+)'/g)];
  const existingGameNames = existingGamesMatches.map((match) => match[1]);

  if (existingGameNames.includes(gameName)) {
    console.error(`❌ Error: Game '${gameName}' already exists in GAMES array`);
    return false;
  }

  const gameObjectRegex =
    /\{[\s\S]*?name: '([^']+)',[\s\S]*?code: '([^']+)',[\s\S]*?key: '([^']+)',[\s\S]*?\}/g;
  const existingGames = [];
  let match;
  while ((match = gameObjectRegex.exec(gamesArrayContent)) !== null) {
    existingGames.push({
      name: match[1],
      code: match[2],
      key: match[3],
      fullText: match[0],
    });
  }

  const gameKey = convertNameToKey(gameName);
  const newGame = {
    name: gameName,
    code: gameCode,
    key: gameKey,
    fullText: `  {
    name: '${gameName}',
    code: '${gameCode}',
    key: '${gameKey}',
  }`,
  };

  existingGames.push(newGame);
  existingGames.sort((a, b) => a.name.localeCompare(b.name));

  const sortedGamesContent = existingGames.map((game) => game.fullText).join(',\n');
  const updatedGamesArray = `const GAMES = [\n${sortedGamesContent},\n];`;
  const updatedContent = fileContent.replace(/const GAMES = \[[\s\S]*?\];/, updatedGamesArray);

  fs.writeFileSync(constantsPath, updatedContent, 'utf-8');
  console.log(`✅ Updated GAMES constant with ${gameName} (added in alphabetical order)`);

  return true;
}

/**
 * Creates game folder and generates pre-populated files
 */
async function createGameFolder(gameName, metadata) {
  const enginePath = path.resolve(__dirname, '../../functions/src/engine', gameName);

  if (!fs.existsSync(enginePath)) {
    fs.mkdirSync(enginePath, { recursive: true });
    console.log(`✅ Created folder: functions/src/engine/${gameName}`);
  } else {
    console.log(`⚠️  Folder already exists: functions/src/engine/${gameName}`);
  }

  // Generate files with content
  const files = {
    'constants.ts': generateConstants(metadata),
    'actions.ts': generateActions(metadata),
    'types.d.ts': generateTypes(metadata),
    'index.ts': generateIndex(metadata),
    'helpers.ts': generateHelpers(metadata),
    'setup.ts': generateSetup(metadata),
    'achievements.ts': generateAchievements(metadata),
    'data.ts': generateData(metadata),
  };

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(enginePath, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Created file: ${filename}`);
    } else {
      console.log(`⚠️  File already exists: ${filename}`);
    }
  }

  return true;
}

/**
 * Enhanced backend setup with interactive prompts
 * @param {Function} prompt - Prompt function from parent
 */
async function runBackendSetup(prompt) {
  console.log('\n🎮 Backend Setup - Game Engine Creation\n');

  // Prompt for game name
  let gameName = '';
  while (!gameName) {
    const input = await prompt('Enter the game name (lowercase, use hyphens for spaces, e.g., "my-game"): ');
    if (validateGameName(input)) {
      gameName = input;
    } else {
      console.log('❌ Invalid game name. Please use lowercase letters and hyphens only (e.g., "my-game").\n');
    }
  }

  // Prompt for game code
  let gameCode = '';
  while (!gameCode) {
    const input = await prompt('Enter the game code (single capital letter, e.g., "G"): ');
    if (validateGameCode(input)) {
      gameCode = input;
    } else {
      console.log('❌ Invalid game code. Please use a single capital letter (A-Z).\n');
    }
  }

  // Interactive prompts for game metadata
  const phases = await promptForPhases(prompt);
  const actions = await promptForActions(prompt);
  const playerCounts = await promptForPlayerCounts(prompt);
  const rounds = await promptForRounds(prompt);

  // Build complete metadata object
  const gameKey = convertNameToKey(gameName);
  const metadata = {
    gameName,
    gameCode,
    gameKey,
    phases,
    actions,
    playerCounts,
    rounds,
  };

  // Display summary and confirm
  displayMetadataSummary(metadata);

  const confirm = await prompt('Proceed with these settings? (yes/no): ');

  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('\n❌ Operation cancelled.\n');
    return;
  }

  console.log('\n🔧 Setting up the game backend...\n');

  // Update GAMES constant
  const constantsUpdated = await updateGamesConstant(gameName, gameCode);

  if (!constantsUpdated) {
    console.log('\n❌ Failed to update constants. Aborting.\n');
    return;
  }

  // Create game folder with pre-populated files
  await createGameFolder(gameName, metadata);

  console.log('\n✨ Game backend setup complete!\n');
  console.log('📁 Generated files:');
  console.log(`   • constants.ts - Game phases, actions, player counts${rounds ? ', rounds' : ''}`);
  console.log(`   • actions.ts - ${actions.length} action handler${actions.length > 1 ? 's' : ''}`);
  console.log('   • types.d.ts - TypeScript type definitions');
  console.log('   • index.ts - Game engine interface (4 required exports)');
  console.log(`   • setup.ts - ${phases.length} phase preparation functions`);
  console.log('   • helpers.ts - Utility functions (determineNextPhase)');
  console.log('   • achievements.ts - Achievement system template');
  console.log('   • data.ts - Resource loading template\n');
  console.log(`📂 Game engine location: functions/src/engine/${gameName}/index.ts\n`);
  console.log('Next steps:');
  console.log(`   1. Review and customize the generated files in functions/src/engine/${gameName}/`);
  console.log('   2. Implement game-specific logic in setup.ts phase functions');
  console.log('   3. Define proper types in types.d.ts');
  console.log('   4. Implement resource loading in data.ts if needed\n');
  console.log(
    'After implementing the game logic, run the "Backend engine hookup" option in this CLI to connect your game engine to the backend delegators.\n',
  );
}

// Keep existing functions for steps 2, 3, 4 (backend hookup, frontend game-info, frontend setup)
// These remain unchanged from the original script

module.exports = {
  runBackendSetup,
  updateGamesConstant,
  createGameFolder,
};
