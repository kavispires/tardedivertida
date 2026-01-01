#!/usr/bin/env node

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

function convertNameToKey(name) {
  return name.toUpperCase().replace(/-/g, '_');
}

function validateGameName(name) {
  // Check if name is lowercase, single string with optional hyphens
  const regex = /^[a-z]+(-[a-z]+)*$/;
  return regex.test(name);
}

function validateGameCode(code) {
  // Check if code is a single capital letter
  const regex = /^[A-Z]$/;
  return regex.test(code);
}

async function updateGamesConstant(gameName, gameCode) {
  const constantsPath = path.resolve(__dirname, '../functions/src/utils/constants.ts');

  if (!fs.existsSync(constantsPath)) {
    console.error(`❌ Error: constants.ts not found at ${constantsPath}`);
    return false;
  }

  const fileContent = fs.readFileSync(constantsPath, 'utf-8');

  // Find the GAMES array and add the new entry
  const gamesArrayMatch = fileContent.match(/const GAMES = \[([\s\S]*?)\];/);

  if (!gamesArrayMatch) {
    console.error('❌ Error: Could not find GAMES array in constants.ts');
    return false;
  }

  // Parse existing games to check for duplicates
  const gamesArrayContent = gamesArrayMatch[1];
  const existingGamesMatches = [...gamesArrayContent.matchAll(/name: '([^']+)'/g)];
  const existingGameNames = existingGamesMatches.map(match => match[1]);

  // Check if game already exists
  if (existingGameNames.includes(gameName)) {
    console.error(`❌ Error: Game '${gameName}' already exists in GAMES array`);
    return false;
  }

  // Parse all existing game objects
  const gameObjectRegex = /\{[\s\S]*?name: '([^']+)',[\s\S]*?code: '([^']+)',[\s\S]*?key: '([^']+)',[\s\S]*?\}/g;
  const existingGames = [];
  let match;
  while ((match = gameObjectRegex.exec(gamesArrayContent)) !== null) {
    existingGames.push({
      name: match[1],
      code: match[2],
      key: match[3],
      fullText: match[0]
    });
  }

  // Create new game entry
  const gameKey = convertNameToKey(gameName);
  const newGame = {
    name: gameName,
    code: gameCode,
    key: gameKey,
    fullText: `  {
    name: '${gameName}',
    code: '${gameCode}',
    key: '${gameKey}',
  }`
  };

  // Add new game and sort alphabetically by name
  existingGames.push(newGame);
  existingGames.sort((a, b) => a.name.localeCompare(b.name));

  // Reconstruct the GAMES array with sorted games
  const sortedGamesContent = existingGames.map(game => game.fullText).join(',\n');
  const updatedGamesArray = `const GAMES = [\n${sortedGamesContent},\n];`;

  const updatedContent = fileContent.replace(/const GAMES = \[[\s\S]*?\];/, updatedGamesArray);

  fs.writeFileSync(constantsPath, updatedContent, 'utf-8');
  console.log(`✅ Updated GAMES constant with ${gameName} (added in alphabetical order)`);

  return true;
}

async function createGameFolder(gameName) {
  const enginePath = path.resolve(__dirname, '../functions/src/engine', gameName);

  // Create the game folder
  if (!fs.existsSync(enginePath)) {
    fs.mkdirSync(enginePath, { recursive: true });
    console.log(`✅ Created folder: functions/src/engine/${gameName}`);
  } else {
    console.log(`⚠️  Folder already exists: functions/src/engine/${gameName}`);
  }

  // Create placeholder files
  const files = ['actions.ts', 'constants.ts', 'data.ts', 'helpers.ts', 'index.ts', 'setup.ts', 'types.d.ts'];

  for (const file of files) {
    const filePath = path.join(enginePath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '// TODO: Implement\n', 'utf-8');
      console.log(`✅ Created file: ${file}`);
    } else {
      console.log(`⚠️  File already exists: ${file}`);
    }
  }

  return true;
}

async function main() {
  console.log('\n🎮 Welcome to the Game Onboarding CLI!\n');
  console.log('This tool will help you set up the backend for a new game.\n');

  try {
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

    console.log('\n📋 Summary:');
    console.log(`   Name: ${gameName}`);
    console.log(`   Code: ${gameCode}`);
    console.log(`   Key:  ${convertNameToKey(gameName)}\n`);

    const confirm = await prompt('Proceed with these settings? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('\n❌ Operation cancelled.\n');
      rl.close();
      return;
    }

    console.log('\n🔧 Setting up the game backend...\n');

    // Update GAMES constant
    const constantsUpdated = await updateGamesConstant(gameName, gameCode);

    if (!constantsUpdated) {
      console.log('\n❌ Failed to update constants. Aborting.\n');
      rl.close();
      return;
    }

    // Create game folder and files
    await createGameFolder(gameName);

    console.log('\n✨ Game backend setup complete!\n');
    console.log('Next steps:');
    console.log(`   1. Implement the game logic in functions/src/engine/${gameName}/`);
    console.log('   2. Add game-specific types to types.d.ts');
    console.log('   3. Implement setup logic in setup.ts');
    console.log('   4. Create game actions in actions.ts\n');

  } catch (error) {
    console.error('\n❌ An error occurred:', error.message);
  } finally {
    rl.close();
  }
}

main();
