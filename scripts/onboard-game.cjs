#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import enhanced backend setup
const { runBackendSetup: runEnhancedBackendSetup } = require('./onboard-game/index.cjs');

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

  const delegatorsPath = path.resolve(__dirname, '../functions/src/games/delegators.ts');
  if (!fs.existsSync(delegatorsPath)) {
    console.error('❌ Error: delegators.ts not found');
    return;
  }

  const gameKey = convertNameToKey(gameName);

  let delegatorsContent = fs.readFileSync(delegatorsPath, 'utf-8');

  // --- Insert lazy engine loader ---
  if (delegatorsContent.includes(`[GAME_NAMES.${gameKey}]`)) {
    console.log(`⚠️  Engine loader for '${gameName}' already exists in delegators.ts`);
  } else {
    const entryRegex = /^  \[GAME_NAMES\.(\w+)\]: \(\) => import\('\.\/([^']+)'\),$/gm;
    const entries = [];
    let e;
    while ((e = entryRegex.exec(delegatorsContent)) !== null) {
      entries.push({ key: e[1], gamePath: e[2], fullLine: e[0], index: e.index });
    }

    if (entries.length === 0) {
      console.error('❌ Could not find engineRegistry entries in delegators.ts');
      return;
    }

    const newEntry = `  [GAME_NAMES.${gameKey}]: () => import('./${gameName}'),`;
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

    console.log(`✅ Added lazy engine loader for '${gameName}'`);
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

  let content = fs.readFileSync(infoPath, 'utf-8');

  // Check already exists
  if (content.includes(`import('games/${gameName}/game-info.json')`)) {
    console.log(`⚠️  Entry for '${gameName}' already exists in info.ts`);
    return true;
  }

  const lines = content.split('\n');

  // Find lines in GAME_INFO_PATHS object (new format)
  // Pattern: '  gameName: () => import('games/gameName/game-info.json'),'
  const pathEntryRegex = /^  '?([a-z][a-z0-9-]*)'?:\s*\(\)\s*=>\s*import\('games\/([^']+)\/game-info\.json'\),?$/;

  const pathEntries = [];
  lines.forEach((line, idx) => {
    const match = line.match(pathEntryRegex);
    if (match) {
      pathEntries.push({ idx, name: match[1] });
    }
  });

  if (pathEntries.length === 0) {
    console.error('❌ Could not find GAME_INFO_PATHS entries in info.ts');
    return false;
  }

  // Find where to insert (alphabetically)
  let insertBefore = pathEntries.findIndex((entry) => entry.name > gameName);
  if (insertBefore === -1) insertBefore = pathEntries.length;

  // Determine insertion index
  const insertIdx = insertBefore < pathEntries.length
    ? pathEntries[insertBefore].idx
    : pathEntries[pathEntries.length - 1].idx + 1;

  // Create new line (use quotes if game name has hyphens)
  const needsQuotes = gameName.includes('-');
  const key = needsQuotes ? `'${gameName}'` : gameName;
  const newLine = `  ${key}: () => import('games/${gameName}/game-info.json'),`;

  // Insert the line
  lines.splice(insertIdx, 0, newLine);

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

function convertToPascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function copyDirRecursive(src, dest, excludeFiles = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (excludeFiles.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, excludeFiles);
    } else {
      fs.copyFileSync(srcPath, destPath);
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
  let content = fs.readFileSync(constantsPath, 'utf-8');

  if (content.includes(`${gameKey}: '${gameName}'`)) {
    console.log(`⚠️  GAME_COLLECTION.${gameKey} already exists in src/utils/constants.ts`);
    return true;
  }

  // Find all existing entries like "  KEY: 'value'," within GAME_COLLECTION
  const entryRegex = /^  ([A-Z][A-Z0-9_]+): '[^']+',?(?:\s*\/\/.*)?$/gm;
  const entries = [];
  let m;
  while ((m = entryRegex.exec(content)) !== null) {
    entries.push({ key: m[1], fullLine: m[0], index: m.index });
  }

  const newEntry = `  ${gameKey}: '${gameName}',`;
  let insertAfter = null;
  for (const entry of entries) {
    if (entry.key < gameKey && entry.key !== '_TEMPLATE') {
      insertAfter = entry;
    }
  }

  if (insertAfter) {
    const pos = insertAfter.index + insertAfter.fullLine.length;
    content = content.slice(0, pos) + '\n' + newEntry + content.slice(pos);
  } else {
    // Insert after _TEMPLATE line
    const templateMatch = content.match(/  _TEMPLATE: '[^']+',?\n/);
    if (templateMatch) {
      const pos = content.indexOf(templateMatch[0]) + templateMatch[0].length;
      content = content.slice(0, pos) + newEntry + '\n' + content.slice(pos);
    }
  }

  fs.writeFileSync(constantsPath, content, 'utf-8');
  console.log(`✅ Added GAME_COLLECTION.${gameKey} to src/utils/constants.ts`);
  return true;
}

function updateAchievementsDict(gameName) {
  const achievementsPath = path.resolve(__dirname, '../src/utils/achievements.ts');
  if (!fs.existsSync(achievementsPath)) {
    console.error('❌ Error: src/utils/achievements.ts not found');
    return false;
  }

  const needsQuotes = gameName.includes('-');
  const returnKey = needsQuotes ? `'${gameName}'` : gameName;

  let content = fs.readFileSync(achievementsPath, 'utf-8');

  if (content.includes(`${returnKey}: `)) {
    console.log(`⚠️  ACHIEVEMENTS_DICT entry for '${gameName}' already exists`);
    return true;
  }

  // Find all existing entries like "  'game-name': VALUE," or "  gamename: VALUE,"
  const entryRegex = /^  ('?[a-z][a-z0-9-]*'?): (?:null|[A-Z_]+),?$/gm;
  const entries = [];
  let m;
  while ((m = entryRegex.exec(content)) !== null) {
    const rawKey = m[1].replace(/'/g, '');
    entries.push({ rawKey, fullLine: m[0], index: m.index });
  }

  const newEntry = `  ${returnKey}: null,`;
  let insertAfter = null;
  for (const entry of entries) {
    if (entry.rawKey < gameName) {
      insertAfter = entry;
    }
  }

  if (insertAfter) {
    const pos = insertAfter.index + insertAfter.fullLine.length;
    content = content.slice(0, pos) + '\n' + newEntry + content.slice(pos);
  } else if (entries.length > 0) {
    const first = entries[0];
    content = content.slice(0, first.index) + newEntry + '\n' + content.slice(first.index);
  }

  fs.writeFileSync(achievementsPath, content, 'utf-8');
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

  let content = fs.readFileSync(loaderPath, 'utf-8');

  if (content.includes(`games/${gameName}/Session${pascalName}`)) {
    console.log(`⚠️  gameLoader entry for '${gameName}' already exists`);
    return true;
  }

  const entryRegex = /^  \[GAME_COLLECTION\.([A-Z][A-Z0-9_]+)\]: lazy\(\(\) => import\('games\/([^']+)\/Session[^']+'\)\),$/gm;
  const entries = [];
  let m;
  while ((m = entryRegex.exec(content)) !== null) {
    entries.push({ key: m[1], gamePath: m[2], fullLine: m[0], index: m.index });
  }

  // Also match multi-line entries (wrapped with lazy())
  const multiLineRegex = /  \[GAME_COLLECTION\.([A-Z][A-Z0-9_]+)\]: lazy\(\n.*?import\('games\/([^']+)\/Session[^']+'\),?\n  \),/gs;
  while ((m = multiLineRegex.exec(content)) !== null) {
    // avoid duplicates
    if (!entries.find((e) => e.key === m[1])) {
      entries.push({ key: m[1], gamePath: m[2], fullLine: m[0], index: m.index });
    }
  }

  const newEntry = `  [GAME_COLLECTION.${gameKey}]: lazy(() => import('games/${gameName}/Session${pascalName}')),`;

  let insertAfter = null;
  for (const entry of entries) {
    if (entry.key < gameKey) {
      insertAfter = entry;
    }
  }

  if (insertAfter) {
    const pos = insertAfter.index + insertAfter.fullLine.length;
    content = content.slice(0, pos) + '\n' + newEntry + content.slice(pos);
  } else if (entries.length > 0) {
    const first = entries[0];
    content = content.slice(0, first.index) + newEntry + '\n' + content.slice(first.index);
  }

  fs.writeFileSync(loaderPath, content, 'utf-8');
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

  // Try to detect phases and actions from engine constants
  const engineConstantsPath = path.resolve(__dirname, `../functions/src/engine/${gameName}/constants.ts`);
  let firstPhase = 'UNKNOWN';
  let allPhases = [];
  let firstAction = 'UNKNOWN';
  if (fs.existsSync(engineConstantsPath)) {
    const engineConstants = fs.readFileSync(engineConstantsPath, 'utf-8');
    const phasesMatch = engineConstants.match(/PHASES\s*=\s*\{([\s\S]*?)\}/);
    if (phasesMatch) {
      const keyMatches = [...phasesMatch[1].matchAll(/([A-Z_]+)\s*:/g)];
      allPhases = keyMatches.map((m) => m[1]);
      if (allPhases.length > 0) {
        firstPhase = allPhases[0];
      }
    }
    const actionsMatch = engineConstants.match(/ACTIONS\s*=\s*\{([\s\S]*?)\}/);
    if (actionsMatch) {
      const firstActionMatch = actionsMatch[1].match(/([A-Z_]+)\s*:/);
      if (firstActionMatch) {
        firstAction = firstActionMatch[1];
      }
    }
  }

  // Copy all template files except game-info.json, renaming SessionTemplate
  console.log('\n🔧 Copying template files...\n');
  for (const entry of fs.readdirSync(templatePath, { withFileTypes: true })) {
    if (entry.name === 'game-info.json') continue;

    const srcPath = path.join(templatePath, entry.name);

    if (entry.isDirectory()) {
      const destDir = path.join(gameFolderPath, entry.name);
      copyDirRecursive(srcPath, destDir);
      console.log(`✅ Copied folder: ${entry.name}/`);
      continue;
    }

    // Rename SessionTemplate.tsx
    const destName = entry.name === 'SessionTemplate.tsx' ? `Session${pascalName}.tsx` : entry.name;
    const destPath = path.join(gameFolderPath, destName);

    if (fs.existsSync(destPath)) {
      console.log(`⚠️  File already exists, skipping: ${destName}`);
      continue;
    }

    let fileContent = fs.readFileSync(srcPath, 'utf-8');

    // Replace references inside the session file
    if (entry.name === 'SessionTemplate.tsx') {
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

    // Replace references inside PhaseTemplate.tsx
    if (entry.name === 'PhaseTemplate.tsx') {
      fileContent = fileContent
        .replace(/TEMPLATE_PHASES/g, `${gameKey}_PHASES`)
        .replace(new RegExp(`${gameKey}_PHASES\\.UNKNOWN`, 'g'), `${gameKey}_PHASES.${firstPhase}`);
    }

    // Replace references inside api-requests.ts
    if (entry.name === 'api-requests.ts') {
      fileContent = fileContent
        .replace(/TEMPLATE_ACTIONS/g, `${gameKey}_ACTIONS`)
        .replace(new RegExp(`${gameKey}_ACTIONS\\.UNKNOWN`, 'g'), `${gameKey}_ACTIONS.${firstAction}`);
    }

    fs.writeFileSync(destPath, fileContent, 'utf-8');
    console.log(`✅ Created file: ${destName}`);
  }

  // If engine constants exist, copy them to utils/constants.ts
  if (fs.existsSync(engineConstantsPath)) {
    const destConstantsPath = path.join(gameFolderPath, 'utils', 'constants.ts');
    fs.copyFileSync(engineConstantsPath, destConstantsPath);
    console.log(`✅ Copied engine constants.ts to src/games/${gameName}/utils/constants.ts`);
  }

  // Add to GAME_COLLECTION
  updateGameCollection(gameName);

  // Add to gameLoader.ts
  updateGameLoader(gameName);

  // Add to ACHIEVEMENTS_DICT
  updateAchievementsDict(gameName);

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
      await runEnhancedBackendSetup(prompt);
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
