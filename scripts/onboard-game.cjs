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

function convertToCamelCase(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
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

async function runBackendSetup() {
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
    return;
  }

  console.log('\n🔧 Setting up the game backend...\n');

  // Update GAMES constant
  const constantsUpdated = await updateGamesConstant(gameName, gameCode);

  if (!constantsUpdated) {
    console.log('\n❌ Failed to update constants. Aborting.\n');
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
  console.log ('After implementing the game logic, run the "Backend engine hookup" option in this CLI to connect your game engine to the backend delegators.\n');
}

async function runBackendEngineHookup() {
  // Ask for game name
  let gameName = '';
  while (!gameName) {
    const input = await prompt('Enter the game name to hookup (e.g., "arte-ruim"): ');
    if (validateGameName(input)) {
      gameName = input;
    } else {
      console.log('❌ Invalid game name. Please use lowercase letters and hyphens only.\n');
    }
  }

  // Check engine folder exists
  const enginePath = path.resolve(__dirname, '../functions/src/engine', gameName);
  if (!fs.existsSync(enginePath)) {
    console.error(`❌ Error: Engine folder not found at functions/src/engine/${gameName}`);
    return;
  }

  // Check index.ts exists
  const indexPath = path.join(enginePath, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: index.ts not found in functions/src/engine/${gameName}`);
    return;
  }

  // Validate required exports
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const requiredExports = ['getInitialState', 'getPlayerCounts', 'getNextPhase', 'submitAction'];
  const missingExports = requiredExports.filter(
    (exp) => !indexContent.includes(`export const ${exp}`) && !indexContent.includes(`export function ${exp}`) && !indexContent.includes(`export async function ${exp}`)
  );

  if (missingExports.length > 0) {
    console.error(`❌ Error: index.ts is missing required exports: ${missingExports.join(', ')}`);
    return;
  }

  console.log(`\n✅ Engine for '${gameName}' found with all required exports.\n`);

  const delegatorsPath = path.resolve(__dirname, '../functions/src/utils/delegators.ts');
  if (!fs.existsSync(delegatorsPath)) {
    console.error('❌ Error: delegators.ts not found');
    return;
  }

  const camelCaseName = convertToCamelCase(gameName);
  const engineVarName = `${camelCaseName}Engine`;
  const gameKey = convertNameToKey(gameName);

  let delegatorsContent = fs.readFileSync(delegatorsPath, 'utf-8');

  // --- Insert import ---
  if (delegatorsContent.includes(`from '../engine/${gameName}'`)) {
    console.log(`⚠️  Import for '${gameName}' already exists in delegators.ts`);
  } else {
    const importRegex = /^import \* as (\w+) from '\.\.\/engine\/([^']+)';$/gm;
    const importLines = [];
    let m;
    while ((m = importRegex.exec(delegatorsContent)) !== null) {
      importLines.push({ varName: m[1], gamePath: m[2], fullLine: m[0], index: m.index });
    }

    const newImportLine = `import * as ${engineVarName} from '../engine/${gameName}';`;
    let insertAfterImport = null;
    for (const imp of importLines) {
      if (imp.gamePath < gameName) {
        insertAfterImport = imp;
      }
    }

    if (insertAfterImport) {
      const pos = insertAfterImport.index + insertAfterImport.fullLine.length;
      delegatorsContent = delegatorsContent.slice(0, pos) + '\n' + newImportLine + delegatorsContent.slice(pos);
    } else if (importLines.length > 0) {
      const first = importLines[0];
      delegatorsContent = delegatorsContent.slice(0, first.index) + newImportLine + '\n' + delegatorsContent.slice(first.index);
    }

    console.log(`✅ Added import for '${gameName}' engine`);
  }

  // --- Insert engines entry ---
  if (delegatorsContent.includes(`[GAME_NAMES.${gameKey}]`)) {
    console.log(`⚠️  Engines entry for '${gameName}' already exists in delegators.ts`);
  } else {
    const entryRegex = /^  \[GAME_NAMES\.(\w+)\]: (\w+),$/gm;
    const entries = [];
    let e;
    while ((e = entryRegex.exec(delegatorsContent)) !== null) {
      entries.push({ key: e[1], fullLine: e[0], index: e.index });
    }

    const newEntry = `  [GAME_NAMES.${gameKey}]: ${engineVarName},`;
    let insertAfterEntry = null;
    for (const entry of entries) {
      if (entry.key < gameKey) {
        insertAfterEntry = entry;
      }
    }

    if (insertAfterEntry) {
      const pos = insertAfterEntry.index + insertAfterEntry.fullLine.length;
      delegatorsContent = delegatorsContent.slice(0, pos) + '\n' + newEntry + delegatorsContent.slice(pos);
    } else if (entries.length > 0) {
      const first = entries[0];
      delegatorsContent = delegatorsContent.slice(0, first.index) + newEntry + '\n' + delegatorsContent.slice(first.index);
    }

    console.log(`✅ Added engines entry for '${gameName}'`);
  }

  fs.writeFileSync(delegatorsPath, delegatorsContent, 'utf-8');
  console.log(`\n✨ Engine hookup complete for '${gameName}'!\n`);
}

function updateInfoTs(gameName) {
  const infoPath = path.resolve(__dirname, '../src/utils/info.ts');
  if (!fs.existsSync(infoPath)) {
    console.error('❌ Error: src/utils/info.ts not found');
    return false;
  }

  const gameKey = convertNameToKey(gameName); // e.g., ARTE_RUIM
  let content = fs.readFileSync(infoPath, 'utf-8');

  // Check already exists
  if (content.includes(`import('games/${gameName}/game-info.json')`)) {
    console.log(`⚠️  Entry for '${gameName}' already exists in info.ts`);
    return true;
  }

  const lines = content.split('\n');

  // Collect destructuring variable lines and their indices
  const varLineRegex = /^    ([A-Z][A-Z0-9_]+),?$/;
  const importLineRegex = /^    import\('games\/([^']+)\/game-info\.json'\),?$/;
  const returnLineRegex = /^    '?([a-z][a-z0-9-]*)'?:\s+[A-Z][A-Z0-9_]+\.default,?$/;

  const varLines = [];
  const importLines = [];
  const returnLines = [];

  lines.forEach((line, idx) => {
    if (varLineRegex.test(line)) varLines.push({ idx, key: line.match(varLineRegex)[1] });
    else if (importLineRegex.test(line)) importLines.push({ idx, name: line.match(importLineRegex)[1] });
    else if (returnLineRegex.test(line)) returnLines.push({ idx, name: line.match(returnLineRegex)[1] });
  });

  if (varLines.length !== importLines.length) {
    console.error('❌ Mismatch between destructuring variables and imports in info.ts');
    return false;
  }

  // --- Insert destructuring variable and import (same index) ---
  let insertVarBefore = varLines.findIndex((v) => v.key > gameKey);
  if (insertVarBefore === -1) insertVarBefore = varLines.length;

  const newVarLine = `    ${gameKey},`;
  const newImportLine = `    import('games/${gameName}/game-info.json'),`;

  // Work on a mutable array; insert from bottom-up to preserve indices
  // First collect what we need to insert and where
  const ops = [];

  const varInsertIdx =
    insertVarBefore < varLines.length ? varLines[insertVarBefore].idx : varLines[varLines.length - 1].idx + 1;
  const importInsertIdx =
    insertVarBefore < importLines.length
      ? importLines[insertVarBefore].idx
      : importLines[importLines.length - 1].idx + 1;

  // --- Insert return object entry ---
  let insertReturnBefore = returnLines.findIndex((r) => r.name > gameName);
  if (insertReturnBefore === -1) insertReturnBefore = returnLines.length;

  const needsQuotes = gameName.includes('-');
  const returnKey = needsQuotes ? `'${gameName}'` : gameName;
  const newReturnLine = `    ${returnKey}: ${gameKey}.default,`;
  const returnInsertIdx =
    insertReturnBefore < returnLines.length
      ? returnLines[insertReturnBefore].idx
      : returnLines[returnLines.length - 1].idx + 1;

  ops.push({ idx: returnInsertIdx, line: newReturnLine });
  ops.push({ idx: importInsertIdx, line: newImportLine });
  ops.push({ idx: varInsertIdx, line: newVarLine });

  // Sort descending by line index so earlier insertions don't shift later ones
  ops.sort((a, b) => b.idx - a.idx);

  for (const op of ops) {
    lines.splice(op.idx, 0, op.line);
  }

  fs.writeFileSync(infoPath, lines.join('\n'), 'utf-8');
  console.log(`✅ Updated src/utils/info.ts with '${gameName}' entry`);
  return true;
}

async function runFrontendGameInfo() {
  // Ask for game name
  let gameName = '';
  while (!gameName) {
    const input = await prompt('Enter the game name (e.g., "arte-ruim"): ');
    if (validateGameName(input)) {
      gameName = input;
    } else {
      console.log('❌ Invalid game name. Please use lowercase letters and hyphens only.\n');
    }
  }

  // Check if folder + game-info already exist
  const gameFolderPath = path.resolve(__dirname, '../src/games', gameName);
  const gameInfoDest = path.join(gameFolderPath, 'game-info.json');
  if (fs.existsSync(gameFolderPath) && fs.existsSync(gameInfoDest)) {
    console.error(`❌ Error: game-info.json already exists at src/games/${gameName}/game-info.json`);
    return;
  }

  // Read template
  const templatePath = path.resolve(__dirname, '../src/games/_template/game-info.json');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Error: Template game-info.json not found at src/games/_template/game-info.json');
    return;
  }
  const gameInfo = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

  // Resolve gameCode from constants.ts if possible
  const constantsPath = path.resolve(__dirname, '../functions/src/utils/constants.ts');
  let gameCode = null;
  if (fs.existsSync(constantsPath)) {
    const constantsContent = fs.readFileSync(constantsPath, 'utf-8');
    const gameEntryRegex = new RegExp(`name:\\s*'${gameName}',[\\s\\S]*?code:\\s*'([^']+)'`, 'g');
    const entryMatch = gameEntryRegex.exec(constantsContent);
    if (entryMatch) {
      gameCode = entryMatch[1];
      console.log(`\n✅ Found game code '${gameCode}' in constants.ts`);
    }
  }

  if (!gameCode) {
    console.log('\n⚠️  Game not found in constants.ts.');
    while (!gameCode) {
      const input = await prompt('Enter the game code (single capital letter, e.g., "G"): ');
      if (validateGameCode(input)) {
        gameCode = input;
      } else {
        console.log('❌ Invalid game code. Please use a single capital letter (A-Z).\n');
      }
    }
  }

  // Ask for titles
  const titlePt = await prompt('Enter the game title in Portuguese: ');
  const titleEn = await prompt('Enter the game title in English: ');

  // Ask for inspiredBy
  const inspiredByInput = await prompt('Enter the game that inspired it (will be reversed, leave blank to skip): ');
  const inspiredBy = inspiredByInput ? inspiredByInput.split('').reverse().join('') : gameInfo.inspiredBy;

  // Try to read playerCounts from engine constants.ts
  let playerMin = gameInfo.playerCount.min;
  let playerMax = gameInfo.playerCount.max;
  const engineConstantsPath = path.resolve(__dirname, `../functions/src/engine/${gameName}/constants.ts`);
  if (fs.existsSync(engineConstantsPath)) {
    const engineConstants = fs.readFileSync(engineConstantsPath, 'utf-8');
    const minMatch = engineConstants.match(/PLAYER_COUNTS\s*=\s*\{[\s\S]*?MIN:\s*(\d+)/);
    const maxMatch = engineConstants.match(/PLAYER_COUNTS\s*=\s*\{[\s\S]*?MAX:\s*(\d+)/);
    if (minMatch && maxMatch) {
      playerMin = parseInt(minMatch[1], 10);
      playerMax = parseInt(maxMatch[1], 10);
      console.log(`\n✅ Found player counts from engine: MIN=${playerMin}, MAX=${playerMax}`);
    } else {
      console.log('\n⚠️  Could not parse PLAYER_COUNTS from engine constants.ts, using template defaults.');
    }
  }

  // Populate game-info
  gameInfo.gameCode = gameCode;
  gameInfo.gameName = gameName;
  gameInfo.version = '0.0.0';
  gameInfo.title.pt = titlePt || gameInfo.title.pt;
  gameInfo.title.en = titleEn || gameInfo.title.en;
  gameInfo.inspiredBy = inspiredBy;
  gameInfo.playerCount.min = playerMin;
  gameInfo.playerCount.max = playerMax;

  // Create folder and write file
  if (!fs.existsSync(gameFolderPath)) {
    fs.mkdirSync(gameFolderPath, { recursive: true });
    console.log(`\n✅ Created folder: src/games/${gameName}/`);
  }
  fs.writeFileSync(gameInfoDest, JSON.stringify(gameInfo, null, 2) + '\n', 'utf-8');
  console.log(`✅ Created file: src/games/${gameName}/game-info.json`);

  // Update info.ts
  updateInfoTs(gameName);

  console.log(`\n✨ Frontend game-info setup complete for '${gameName}'!\n`);
  console.log('Next steps:');
  console.log('   1. You must create and add the images for the banner, strip, and logo.');
  console.log('   2. Create and add the video backend.');
  console.log('   3. Implement the frontend game components in src/games/${gameName}/\n');
}

async function runFrontendSetup() {
  console.log('\nOk\n');
}

async function main() {
  console.log('\n🎮 Welcome to the Game Onboarding CLI!\n');

  const menuOptions = [
    '1. Backend setup',
    '2. Backend engine hookup',
    '3. Frontend game-info',
    '4. Frontend setup',
  ];
  console.log('What would you like to do?\n');
  menuOptions.forEach((option) => console.log(`   ${option}`));
  console.log();

  let choice = '';
  while (!choice) {
    const input = await prompt('Enter your choice (1/2/3/4): ');
    if (['1', '2', '3', '4'].includes(input)) {
      choice = input;
    } else {
      console.log('❌ Invalid choice. Please enter 1, 2, 3, or 4.\n');
    }
  }

  try {
    if (choice === '1') {
      await runBackendSetup();
    } else if (choice === '2') {
      await runBackendEngineHookup();
    } else if (choice === '3') {
      await runFrontendGameInfo();
    } else if (choice === '4') {
      await runFrontendSetup();
    }
  } catch (error) {
    console.error('\n❌ An error occurred:', error.message);
  } finally {
    rl.close();
  }
}

main();
