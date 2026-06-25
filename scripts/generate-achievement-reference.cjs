#!/usr/bin/env node

/**
 * Script to generate frontend achievement reference files from backend achievement definitions.
 *
 * Usage:
 * node scripts/generate-achievement-reference.cjs [gameName]
 * node scripts/generate-achievement-reference.cjs . (runs on all valid games)
 *
 * This script:
 * - Reads backend achievements.ts (functions/src/games/{game}/achievements.ts)
 * - Extracts achievement IDs and doc strings
 * - Generates/merges frontend achievements.ts (src/games/{game}/utils/achievements.ts)
 * - Preserves existing icons, titles, and descriptions
 * - Removes redundant ACHIEVEMENTS constant if present
 */

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

/**
 * Parse backend achievements.ts file to extract achievement definitions
 */
function parseBackendAchievements(content) {
  const achievements = [];

  // Extract from .counter()
  const counterRegex = /\.counter\(\s*['"]([^'"]+)['"]\s*,\s*\{([^}]+)\}/g;
  let match;

  while ((match = counterRegex.exec(content)) !== null) {
    const property = match[1];
    const config = match[2];

    const docMatch = config.match(/doc:\s*['"']([^'"]+)['"']/);
    const mostMatch = config.match(/most:\s*['"']([^'"]+)['"']/);
    const leastMatch = config.match(/least:\s*['"']([^'"]+)['"']/);

    if (docMatch) {
      const doc = docMatch[1];
      if (mostMatch && mostMatch[1]) {
        achievements.push({ id: mostMatch[1], doc, property, type: 'counter-most' });
      }
      if (leastMatch && leastMatch[1]) {
        achievements.push({ id: leastMatch[1], doc, property, type: 'counter-least' });
      }
    }
  }

  // Extract from .array() - need to handle nested objects
  const arrayRegex = /\.array\(\s*['"]([^'"]+)['"]\s*,\s*\{([\s\S]*?)\n\s*\}\s*\)/g;

  while ((match = arrayRegex.exec(content)) !== null) {
    const property = match[1];
    const config = match[2];

    const docMatch = config.match(/doc:\s*['"']([^'"]+)['"']/);

    if (docMatch) {
      const doc = docMatch[1];

      // Extract nested achievement IDs from various calculation methods
      // New syntax uses nested objects: extremes: { highest, lowest }, occurrence: { earliest, latest }, unique: { most, least }, uniqueItems: { most, least }

      // Handle extremes
      const highestMatch = config.match(/highest:\s*['"']([^'"]+)['"']/);
      if (highestMatch && highestMatch[1]) {
        achievements.push({ id: highestMatch[1], doc, property, type: 'array-highest' });
      }

      const lowestMatch = config.match(/lowest:\s*['"']([^'"]+)['"']/);
      if (lowestMatch && lowestMatch[1]) {
        achievements.push({ id: lowestMatch[1], doc, property, type: 'array-lowest' });
      }

      // Handle occurrence
      const earliestMatch = config.match(/earliest:\s*['"']([^'"]+)['"']/);
      if (earliestMatch && earliestMatch[1]) {
        achievements.push({ id: earliestMatch[1], doc, property, type: 'array-earliest' });
      }

      const latestMatch = config.match(/latest:\s*['"']([^'"]+)['"']/);
      if (latestMatch && latestMatch[1]) {
        achievements.push({ id: latestMatch[1], doc, property, type: 'array-latest' });
      }

      // Handle unique or average - extract the nested object content
      const uniqueBlockMatch = config.match(/(?:unique|average):\s*\{([^}]+)\}/);
      if (uniqueBlockMatch) {
        const uniqueBlock = uniqueBlockMatch[1];

        const mostMatch = uniqueBlock.match(/most:\s*['"']([^'"]+)['"']/);
        if (mostMatch && mostMatch[1]) {
          achievements.push({ id: mostMatch[1], doc, property, type: 'array-most-unique' });
        }

        const leastMatch = uniqueBlock.match(/least:\s*['"']([^'"]+)['"']/);
        if (leastMatch && leastMatch[1]) {
          achievements.push({ id: leastMatch[1], doc, property, type: 'array-least-unique' });
        }
      }

      // Handle run - extract the nested object content
      const runBlockMatch = config.match(/run:\s*\{([^}]+)\}/);
      if (runBlockMatch) {
        const runBlock = runBlockMatch[1];

        const longestMatch = runBlock.match(/longest:\s*['"']([^'"]+)['"']/);
        if (longestMatch && longestMatch[1]) {
          achievements.push({ id: longestMatch[1], doc, property, type: 'array-longest-run' });
        }

        const shortestMatch = runBlock.match(/shortest:\s*['"']([^'"]+)['"']/);
        if (shortestMatch && shortestMatch[1]) {
          achievements.push({ id: shortestMatch[1], doc, property, type: 'array-shortest-run' });
        }
      }
    }
  }

  // Extract from .exactMatch() and .truthy()
  const exactMatchRegex = /\.(?:exactMatch|truthy)\(\s*['"]([^'"]+)['"]\s*,\s*\{([^}]+)\}/g;

  while ((match = exactMatchRegex.exec(content)) !== null) {
    const property = match[1];
    const config = match[2];

    const docMatch = config.match(/doc:\s*['"']([^'"]+)['"']/);
    const achievementMatch = config.match(/(?:achievement|key):\s*['"']([^'"]+)['"']/);

    if (docMatch && achievementMatch && achievementMatch[1]) {
      achievements.push({
        id: achievementMatch[1],
        doc: docMatch[1],
        property,
        type: 'exact-or-truthy'
      });
    }
  }

  return achievements;
}

/**
 * Parse existing frontend achievements.ts to extract current data
 */
function parseFrontendAchievements(content) {
  const existing = {};

  // First, let's extract the achievementsReference object content
  const refMatch = content.match(/achievementsReference:\s*AchievementReference\s*=\s*\{([\s\S]*)\};/);
  if (!refMatch) {
    return existing;
  }

  const achievementsContent = refMatch[1];

  // Match achievement entries - handle both bracket notation and direct keys
  // We need to carefully match nested braces
  const lines = achievementsContent.split('\n');
  let currentId = null;
  let currentBody = [];
  let braceDepth = 0;

  for (const line of lines) {
    // Check for achievement ID line
    const idMatch = line.match(/^\s*(?:\[[\w.]+\.(\w+)\]|(\w+)):\s*\{\s*$/);
    if (idMatch && braceDepth === 0) {
      // Save previous achievement if exists
      if (currentId) {
        existing[currentId] = parseAchievementBody(currentBody.join('\n'));
      }
      // Start new achievement
      currentId = idMatch[1] || idMatch[2];
      currentBody = [];
      braceDepth = 1;
      continue;
    }

    // Track brace depth
    if (currentId) {
      currentBody.push(line);
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      // If we've closed all braces, this achievement is complete
      if (braceDepth === 0) {
        existing[currentId] = parseAchievementBody(currentBody.join('\n'));
        currentId = null;
        currentBody = [];
      }
    }
  }

  return existing;
}

/**
 * Escape single quotes in a string for JavaScript output
 */
function escapeSingleQuotes(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Unescape single quotes when reading from existing file
 */
function unescapeSingleQuotes(str) {
  return str.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

/**
 * Parse the body of an achievement entry
 */
function parseAchievementBody(body) {
  // Match either 'value' or "value" for each field
  // Using separate patterns for single and double quotes to handle apostrophes
  // Pattern ((?:[^'\\]|\\.)*)  matches: anything that's not a quote or backslash, OR backslash followed by any char
  const iconMatch = body.match(/icon:\s*'((?:[^'\\]|\\.)*)'/s) || body.match(/icon:\s*"([^"]*)"/s);
  const titleEnMatch = body.match(/title:\s*\{[\s\S]*?en:\s*'((?:[^'\\]|\\.)*)'/s) || body.match(/title:\s*\{[\s\S]*?en:\s*"([^"]*)"/s);
  const titlePtMatch = body.match(/title:\s*\{[\s\S]*?pt:\s*'((?:[^'\\]|\\.)*)'/s) || body.match(/title:\s*\{[\s\S]*?pt:\s*"([^"]*)"/s);
  const descEnMatch = body.match(/description:\s*\{[\s\S]*?en:\s*'((?:[^'\\]|\\.)*)'/s) || body.match(/description:\s*\{[\s\S]*?en:\s*"([^"]*)"/s);
  const descPtMatch = body.match(/description:\s*\{[\s\S]*?pt:\s*'((?:[^'\\]|\\.)*)'/s) || body.match(/description:\s*\{[\s\S]*?pt:\s*"([^"]*)"/s);
  const docMatch = body.match(/doc:\s*'((?:[^'\\]|\\.)*)'/s) || body.match(/doc:\s*"([^"]*)"/s);

  return {
    icon: iconMatch ? unescapeSingleQuotes(iconMatch[1]) : '',
    title: {
      en: titleEnMatch ? unescapeSingleQuotes(titleEnMatch[1]) : '',
      pt: titlePtMatch ? unescapeSingleQuotes(titlePtMatch[1]) : '',
    },
    description: {
      en: descEnMatch ? unescapeSingleQuotes(descEnMatch[1]) : '',
      pt: descPtMatch ? unescapeSingleQuotes(descPtMatch[1]) : '',
    },
    doc: docMatch ? unescapeSingleQuotes(docMatch[1]) : '',
  };
}

/**
 * Generate frontend achievements.ts content
 */
function generateFrontendContent(achievements, existing) {
  const merged = {};
  let incompleteCount = 0;

  for (const achievement of achievements) {
    const { id, doc, property } = achievement;

    if (existing[id]) {
      merged[id] = {
        ...existing[id],
        doc,
        property,
      };
    } else {
      merged[id] = {
        id,
        icon: '',
        title: { en: '', pt: '' },
        description: { en: '', pt: '' },
        doc,
        property,
      };
    }
  }

  const sortedIds = Object.keys(merged).sort((a, b) => {
    const propA = merged[a].property;
    const propB = merged[b].property;

    if (propA !== propB) {
      return propA.localeCompare(propB);
    }

    return a.localeCompare(b);
  });

  // Calculate incomplete entries
  for (const id of sortedIds) {
    const data = merged[id];
    const isMissingField =
      !data.icon.trim() ||
      !data.title.en.trim() ||
      !data.title.pt.trim() ||
      !data.description.en.trim() ||
      !data.description.pt.trim();

    if (isMissingField) {
      incompleteCount++;
    }
  }

  let content = `// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {\n`;

  for (const id of sortedIds) {
    const data = merged[id];
    content += `  ${id}: {\n`;
    content += `    id: '${escapeSingleQuotes(id)}',\n`;
    content += `    doc: '${escapeSingleQuotes(data.doc)}',\n`;
    content += `    icon: '${escapeSingleQuotes(data.icon)}',\n`;
    content += `    title: {\n`;
    content += `      en: '${escapeSingleQuotes(data.title.en)}',\n`;
    content += `      pt: '${escapeSingleQuotes(data.title.pt)}',\n`;
    content += `    },\n`;
    content += `    description: {\n`;
    content += `      en: '${escapeSingleQuotes(data.description.en)}',\n`;
    content += `      pt: '${escapeSingleQuotes(data.description.pt)}',\n`;
    content += `    },\n`;
    content += `  },\n`;
  }

  content += `};\n\nexport default achievementsReference;\n`;

  return { content, incompleteCount };
}

/**
 * Retrieve all valid games based on game-info.json metadata
 */
function getValidGames() {
  const gamesDir = path.resolve(__dirname, '../src/games');
  const excludedReleases = ['planned', 'deprecated', 'paused', 'cancelled'];
  const validGames = [];

  if (!fs.existsSync(gamesDir)) return validGames;

  const gameDirectories = fs.readdirSync(gamesDir).filter(dir => {
    const fullPath = path.join(gamesDir, dir);
    return fs.statSync(fullPath).isDirectory() && dir !== '_template';
  });

  for (const gameDir of gameDirectories) {
    const gameInfoPath = path.join(gamesDir, gameDir, 'game-info.json');
    if (fs.existsSync(gameInfoPath)) {
      try {
        const gameInfo = JSON.parse(fs.readFileSync(gameInfoPath, 'utf8'));
        if (!excludedReleases.includes(gameInfo.release)) {
          validGames.push(gameDir);
        }
      } catch (error) {
        console.error(`Error reading ${gameDir}/game-info.json:`, error.message);
      }
    }
  }

  return validGames.sort();
}

/**
 * Process a single game's achievements
 */
async function processGame(gameName, silent = false) {
  if (!silent) console.log(`\n================================\n🎮 Processing: ${gameName}\n================================`);

  const backendPath = path.resolve(__dirname, `../functions/src/games/${gameName}/achievements.ts`);
  const frontendPath = path.resolve(__dirname, `../src/games/${gameName}/utils/achievements.ts`);

  if (!fs.existsSync(backendPath)) {
    if (!silent) console.error(`❌ Backend achievements file not found`);
    return { success: false, reason: 'missing_backend' };
  }

  if (!silent) console.log(`📖 Reading backend...`);
  const backendContent = fs.readFileSync(backendPath, 'utf-8');
  const achievements = parseBackendAchievements(backendContent);

  if (achievements.length === 0) {
    if (!silent) console.error('❌ No achievements found in backend file');
    return { success: false, reason: 'no_achievements' };
  }

  if (!silent) {
    console.log(`✅ Found ${achievements.length} achievement(s):`);
    achievements.forEach(a => console.log(`   - ${a.id} (${a.type})`));
  }

  let existing = {};
  if (fs.existsSync(frontendPath)) {
    const frontendContent = fs.readFileSync(frontendPath, 'utf-8');
    existing = parseFrontendAchievements(frontendContent);
    if (!silent) console.log(`✅ Found ${Object.keys(existing).length} existing achievement(s) frontend`);
  } else {
    const utilsDir = path.dirname(frontendPath);
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }
    if (!silent) console.log(`📝 Created frontend directory`);
  }

  // Detect orphaned achievements (exist in frontend but not in backend)
  const backendIds = new Set(achievements.map(a => a.id));
  const frontendIds = Object.keys(existing);
  const orphanedIds = frontendIds.filter(id => !backendIds.has(id));

  const { content: newContent, incompleteCount } = generateFrontendContent(achievements, existing);
  fs.writeFileSync(frontendPath, newContent, 'utf-8');

  const newIds = achievements.filter(a => !existing[a.id]).map(a => a.id);
  const updatedIds = achievements.filter(a => existing[a.id]).map(a => a.id);

  if (!silent) {
    console.log(`✅ Generated: ${frontendPath}`);
    if (newIds.length > 0) {
      console.log(`\n📝 New achievements (need translation):`);
      newIds.forEach(id => console.log(`   - ${id}`));
    }
    if (updatedIds.length > 0) {
      console.log(`\n♻️  Preserved existing achievements:`);
      updatedIds.forEach(id => console.log(`   - ${id}`));
    }
    if (orphanedIds.length > 0) {
      console.log(`\n⚠️  Orphaned achievements (exist in frontend but not in backend):`);
      orphanedIds.forEach(id => console.log(`   - ${id}`));
    }

    // Output single game report
    if (incompleteCount > 0) {
      console.log(`\n⚠️  ${gameName} has ${incompleteCount} incomplete entries`);
    } else {
      console.log(`\n✨ ${gameName} has 0 incomplete entries!`);
    }
  }

  return { success: true, newCount: newIds.length, updatedCount: updatedIds.length, incompleteCount, orphanedCount: orphanedIds.length };
}

async function main() {
  console.log('🏆 Achievement Reference Generator\n');

  let gameArg = process.argv[2];

  if (!gameArg) {
    gameArg = await prompt('Enter game name (e.g., adedanhx) or "." for all valid games: ');
  }

  if (!gameArg) {
    console.error('❌ Game name or "." is required');
    rl.close();
    process.exit(1);
  }

  if (gameArg === '.') {
    const validGames = getValidGames();
    console.log(`🎯 Running batch process against ${validGames.length} valid games...\n`);

    const processedGames = [];
    const skippedMissingBackend = [];
    const skippedNoAchievements = [];

    for (const gameName of validGames) {
      const result = await processGame(gameName, true); // silent mode to reduce noise

      if (result.success) {
        processedGames.push({
          name: gameName,
          new: result.newCount,
          updated: result.updatedCount,
          incomplete: result.incompleteCount,
          orphaned: result.orphanedCount
        });
        const orphanedMsg = result.orphanedCount > 0 ? `, ${result.orphanedCount} orphaned` : '';
        console.log(`✅ ${gameName} -> Generated (${result.newCount} new, ${result.updatedCount} updated${orphanedMsg})`);
      } else if (result.reason === 'missing_backend') {
        skippedMissingBackend.push(gameName);
      } else if (result.reason === 'no_achievements') {
        skippedNoAchievements.push(gameName);
      }
    }

    console.log('\n================================');
    console.log('✨ BATCH RUN COMPLETED');
    console.log('================================');
    console.log(`✅ Processed: ${processedGames.length}`);

    if (skippedMissingBackend.length > 0) {
      console.log(`\n⏭️  Skipped (No backend achievements.ts file):`);
      console.log(`   ${skippedMissingBackend.join(', ')}`);
    }

    if (skippedNoAchievements.length > 0) {
      console.log(`\n⏭️  Skipped (Backend file exists, but 0 achievements extracted):`);
      console.log(`   ${skippedNoAchievements.join(', ')}`);
    }

    console.log('\n================================');
    console.log('⚠️  INCOMPLETE ENTRIES REPORT');
    console.log('================================');
    processedGames.forEach(g => {
      if (g.incomplete > 0) {
        console.log(`   🟡 ${g.name} has ${g.incomplete} incomplete entries`);
      } else {
        console.log(`   🟢 ${g.name} has 0 incomplete entries`);
      }
    });

    console.log('\n================================');
    console.log('🗑️  ORPHANED ACHIEVEMENTS REPORT');
    console.log('================================');
    const gamesWithOrphans = processedGames.filter(g => g.orphaned > 0);
    if (gamesWithOrphans.length > 0) {
      gamesWithOrphans.forEach(g => {
        console.log(`   🔴 ${g.name} has ${g.orphaned} orphaned achievement(s)`);
      });
    } else {
      console.log(`   ✅ No orphaned achievements found`);
    }

  } else {
    console.log(`🎯 Using game: ${gameArg}`);
    const result = await processGame(gameArg, false);

    if (result.success) {
      console.log('\n✨ Done! Remember to:');
      console.log('   1. Fill in empty icon values');
      console.log('   2. Add English and Portuguese titles');
      console.log('   3. Add English and Portuguese descriptions');
      console.log('   4. Review doc strings from backend');
    }
  }

  rl.close();
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
