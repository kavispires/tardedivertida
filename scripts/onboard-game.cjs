#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import enhanced backend setup
const { runBackendSetup } = require('./onboard-game/index.cjs');
const {
  convertNameToKey,
  convertToPascalCase,
  addRegistryEntry,
  getRegistryKeys,
  validateGameName,
  validateGameCode,
} = require('./onboard-game/utils.cjs');

let rl;

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

// Backend setup is now handled by the enhanced module
// Old functions removed to avoid duplication

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
  const enginePath = path.resolve(__dirname, '../functions/src/games', gameName);
  if (!fs.existsSync(enginePath)) {
    console.error(`❌ Error: Engine folder not found at functions/src/games/${gameName}`);
    return;
  }

  // Check index.ts exists
  const indexPath = path.join(enginePath, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: index.ts not found in functions/src/games/${gameName}`);
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

  const delegatorsPath = path.resolve(__dirname, '../functions/src/games/delegators.ts');
  if (!fs.existsSync(delegatorsPath)) {
    console.error('❌ Error: delegators.ts not found');
    return;
  }

  const gameKey = convertNameToKey(gameName);

  const delegatorsContent = fs.readFileSync(delegatorsPath, 'utf-8');
  const updatedContent = addRegistryEntry(
    delegatorsContent,
    'engineRegistry',
    gameKey,
    `[GAME_NAMES.${gameKey}]: () => import('./${gameName}')`,
  );
  if (updatedContent === delegatorsContent) {
    console.log(`⚠️  Engine loader for '${gameName}' already exists in delegators.ts`);
  } else {
    fs.writeFileSync(delegatorsPath, updatedContent, 'utf-8');
    console.log(`✅ Added lazy engine loader for '${gameName}'`);
  }

  console.log(`\n✨ Engine hookup complete for '${gameName}'!\n`);
}

function updateInfoTs(gameName) {
  const infoPath = path.resolve(__dirname, '../src/utils/info.ts');
  if (!fs.existsSync(infoPath)) {
    console.error('❌ Error: src/utils/info.ts not found');
    return false;
  }

  const content = fs.readFileSync(infoPath, 'utf-8');
  const updatedContent = addRegistryEntry(
    content,
    'GAME_INFO_PATHS',
    gameName,
    `'${gameName}': () => import('@games/${gameName}/game-info.json')`,
  );
  if (updatedContent === content) {
    console.log(`⚠️  Entry for '${gameName}' already exists in info.ts`);
    return true;
  }

  fs.writeFileSync(infoPath, updatedContent, 'utf-8');
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

  // Resolve gameCode from constants/games.ts if possible
  const constantsPath = path.resolve(__dirname, '../functions/src/constants/games.ts');
  let gameCode = null;
  if (fs.existsSync(constantsPath)) {
    const constantsContent = fs.readFileSync(constantsPath, 'utf-8');
    const gameEntryRegex = new RegExp(`name:\\s*'${gameName}',[\\s\\S]*?code:\\s*'([^']+)'`, 'g');
    const entryMatch = gameEntryRegex.exec(constantsContent);
    if (entryMatch) {
      gameCode = entryMatch[1];
      console.log(`\n✅ Found game code '${gameCode}' in games.ts`);
    }
  }

  if (!gameCode) {
    console.log('\n⚠️  Game not found in games.ts.');
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
  const engineConstantsPath = path.resolve(__dirname, `../functions/src/games/${gameName}/constants.ts`);
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
  if (!updateInfoTs(gameName)) return;

  console.log(`\n✨ Frontend game-info setup complete for '${gameName}'!\n`);
  console.log('Next steps:');
  console.log('   1. You must create and add the images for the banner, strip, and logo.');
  console.log('   2. Create and add the video backend.');
  console.log(`   3. Implement the frontend game components in src/games/${gameName}/\n`);
}

function copyDirRecursive(src, dest, transform, relativePath = '') {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (!relativePath && entry.name === 'game-info.json') continue;
    const srcPath = path.join(src, entry.name);
    const sourceRelativePath = path.join(relativePath, entry.name);
    const { filename, content } = entry.isDirectory()
      ? { filename: entry.name }
      : transform(sourceRelativePath, srcPath);
    const destPath = path.join(dest, filename);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, transform, sourceRelativePath);
    } else if (fs.existsSync(destPath)) {
      console.log(`⚠️  File already exists, skipping: ${sourceRelativePath}`);
    } else if (content !== undefined) {
      fs.writeFileSync(destPath, content, { encoding: 'utf-8', flag: 'wx' });
      console.log(`✅ Created file: ${sourceRelativePath}`);
    } else {
      fs.copyFileSync(srcPath, destPath, fs.constants.COPYFILE_EXCL);
      console.log(`✅ Copied file: ${sourceRelativePath}`);
    }
  }
}

function updateGameCollection(gameName) {
  const constantsPath = path.resolve(__dirname, '../src/utils/constants.ts');
  if (!fs.existsSync(constantsPath)) {
    console.error('❌ Error: src/utils/constants.ts not found');
    return false;
  }

  const gameKey = convertNameToKey(gameName);
  const content = fs.readFileSync(constantsPath, 'utf-8');
  const updatedContent = addRegistryEntry(content, 'GAME_COLLECTION', gameKey, `${gameKey}: '${gameName}'`);
  if (updatedContent === content) {
    console.log(`⚠️  GAME_COLLECTION.${gameKey} already exists in src/utils/constants.ts`);
    return true;
  }

  fs.writeFileSync(constantsPath, updatedContent, 'utf-8');
  console.log(`✅ Added GAME_COLLECTION.${gameKey} to src/utils/constants.ts`);
  return true;
}

function updateAchievementsDict(gameName) {
  const achievementsPath = path.resolve(__dirname, '../src/utils/achievements.ts');
  if (!fs.existsSync(achievementsPath)) {
    console.error('❌ Error: src/utils/achievements.ts not found');
    return false;
  }

  const content = fs.readFileSync(achievementsPath, 'utf-8');
  const updatedContent = addRegistryEntry(content, 'ACHIEVEMENTS_DICT', gameName, `'${gameName}': null`);
  if (updatedContent === content) {
    console.log(`⚠️  ACHIEVEMENTS_DICT entry for '${gameName}' already exists`);
    return true;
  }

  fs.writeFileSync(achievementsPath, updatedContent, 'utf-8');
  console.log(`✅ Added '${gameName}' to ACHIEVEMENTS_DICT in src/utils/achievements.ts`);
  return true;
}

function updateGameLoader(gameName) {
  const loaderPath = path.resolve(__dirname, '../src/games/gameLoader.ts');
  if (!fs.existsSync(loaderPath)) {
    console.error('❌ Error: src/games/gameLoader.ts not found');
    return false;
  }

  const gameKey = convertNameToKey(gameName);
  const pascalName = convertToPascalCase(gameName);

  const content = fs.readFileSync(loaderPath, 'utf-8');
  const updatedContent = addRegistryEntry(
    content,
    'gameSessions',
    gameKey,
    `[GAME_COLLECTION.${gameKey}]: lazy(() => import('@games/${gameName}/Session${pascalName}'))`,
  );
  if (updatedContent === content) {
    console.log(`⚠️  gameLoader entry for '${gameName}' already exists`);
    return true;
  }

  fs.writeFileSync(loaderPath, updatedContent, 'utf-8');
  console.log(`✅ Added '${gameName}' to src/games/gameLoader.ts`);
  return true;
}

async function runFrontendSetup() {
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

  // Check game folder exists (must have run step 3 first)
  const gameFolderPath = path.resolve(__dirname, '../src/games', gameName);
  if (!fs.existsSync(gameFolderPath)) {
    console.error(`❌ Error: Folder src/games/${gameName} does not exist. Please run step 3 (Frontend game-info) first.`);
    return;
  }

  const templatePath = path.resolve(__dirname, '../src/games/_template');
  const pascalName = convertToPascalCase(gameName);
  const gameKey = convertNameToKey(gameName);

  const replaceConstants = content => content
    .replace(/\bTEMPLATE_PHASES\b/g, `${gameKey}_PHASES`)
    .replace(/\bTEMPLATE_ACTIONS\b/g, `${gameKey}_ACTIONS`);
  const engineConstantsPath = path.resolve(__dirname, `../functions/src/games/${gameName}/constants.ts`);
  const clientConstantsPath = path.join(gameFolderPath, 'utils', 'constants.ts');
  let constantsContent;
  if (fs.existsSync(clientConstantsPath)) {
    constantsContent = fs.readFileSync(clientConstantsPath, 'utf-8');
  } else if (fs.existsSync(engineConstantsPath)) {
    constantsContent = fs.readFileSync(engineConstantsPath, 'utf-8');
  } else {
    constantsContent = replaceConstants(fs.readFileSync(path.join(templatePath, 'utils', 'constants.ts'), 'utf-8'));
    constantsContent = addRegistryEntry(constantsContent, `${gameKey}_PHASES`, 'GAME_OVER', "GAME_OVER: 'GAME_OVER'");
  }
  const allPhases = getRegistryKeys(constantsContent, `${gameKey}_PHASES`);
  const allActions = getRegistryKeys(constantsContent, `${gameKey}_ACTIONS`);
  const firstPhase = allPhases.find(phase => phase !== 'GAME_OVER');
  const firstAction = allActions[0];
  if (!firstPhase || !allPhases.includes('GAME_OVER') || !firstAction) {
    throw new Error('Game constants must define a playable phase, GAME_OVER, and a player action');
  }

  console.log('\n🔧 Copying template files...\n');
  copyDirRecursive(templatePath, gameFolderPath, (relativePath, srcPath) => {
    const filename = relativePath === 'SessionTemplate.tsx' ? `Session${pascalName}.tsx` : path.basename(srcPath);
    if (relativePath === path.join('utils', 'constants.ts')) return { filename, content: constantsContent };
    if (!/\.tsx?$/.test(srcPath)) return { filename };
    let fileContent = replaceConstants(fs.readFileSync(srcPath, 'utf-8'))
      .replace(new RegExp(`${gameKey}_PHASES\\.UNKNOWN\\b`, 'g'), `${gameKey}_PHASES.${firstPhase}`)
      .replace(new RegExp(`${gameKey}_ACTIONS\\.UNKNOWN\\b`, 'g'), `${gameKey}_ACTIONS.${firstAction}`);
    // Replace references inside the session file
    if (relativePath === 'SessionTemplate.tsx') {
      fileContent = fileContent
        .replace(/SessionTemplate/g, `Session${pascalName}`)
        .replace(/GAME_COLLECTION\._TEMPLATE/g, `GAME_COLLECTION.${gameKey}`)
        // Remove the PHASES import from @utils/phases
        .replace(/import \{ PHASES \} from '@utils\/phases';\n/, '')
        // Add local phases import after GAME_COLLECTION import
        .replace(
          /import \{ GAME_COLLECTION \} from '@utils\/constants';/,
          `import { GAME_COLLECTION } from '@utils/constants';\n// Internal\nimport { ${gameKey}_PHASES } from './utils/constants';`,
        )
        // Replace phase references
        .replace(/PHASES\.TEMPLATE\.UNKNOWN/g, `${gameKey}_PHASES.${firstPhase}`)
        .replace(/PHASES\.DEFAULT\.GAME_OVER/g, `${gameKey}_PHASES.GAME_OVER`);

      // Add extra cases for all phases except LOBBY, RULES, GAME_OVER, and firstPhase (already present)
      const skipPhases = new Set(['LOBBY', 'RULES', 'GAME_OVER', firstPhase]);
      const extraPhases = allPhases.filter((p) => !skipPhases.has(p));
      if (extraPhases.length > 0) {
        const extraCases = extraPhases
          .map((p) => `    case ${gameKey}_PHASES.${p}:\n      return PhasePlaceholder;`)
          .join('\n');
        fileContent = fileContent.replace(
          /( *case [A-Z_]+_PHASES\.[A-Z_]+:\n *return PhasePlaceholder;)/,
          `$1\n${extraCases}`,
        );
      }
    }

    return { filename, content: fileContent };
  });

  // Add to GAME_COLLECTION
  if (!updateGameCollection(gameName)) return;

  // Add to gameLoader.ts
  if (!updateGameLoader(gameName)) return;

  // Add to ACHIEVEMENTS_DICT
  if (!updateAchievementsDict(gameName)) return;

  console.log(`\n✨ Frontend setup complete for '${gameName}'!\n`);
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
      await runBackendSetup(prompt);
    } else if (choice === '2') {
      await runBackendEngineHookup();
    } else if (choice === '3') {
      await runFrontendGameInfo();
    } else if (choice === '4') {
      await runFrontendSetup();
    }
  } catch (error) {
    console.error('\n❌ An error occurred:', error.message);
    process.exitCode = 1;
  } finally {
    rl?.close();
  }
}

module.exports = {
  runBackendEngineHookup,
  runFrontendGameInfo,
  runFrontendSetup,
};

if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ An error occurred:', error.message);
    rl?.close();
    process.exitCode = 1;
  });
}
