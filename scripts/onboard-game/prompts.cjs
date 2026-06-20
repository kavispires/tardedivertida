/**
 * Interactive prompts for game onboarding
 */

const { validatePhaseName, validateActionName } = require('./utils.cjs');

/**
 * Prompts for game phases
 * @param {Function} prompt - Prompt function
 * @returns {Promise<string[]>} Array of phase names
 */
async function promptForPhases(prompt) {
  console.log('\n📋 Phase Configuration');
  console.log('Enter game phases (comma-separated, e.g., "CARD_PLAY, VOTING, RESULTS")');
  console.log('SETUP and GAME_OVER will be added automatically.');
  console.log('Press Enter for default: SETUP, CARD_PLAY, GAME_OVER\n');

  const input = await prompt('Phases: ');

  if (!input || input.trim() === '') {
    return ['SETUP', 'CARD_PLAY', 'GAME_OVER'];
  }

  // Parse input
  const phases = input
    .split(',')
    .map((p) => p.trim().toUpperCase().replace(/\s+/g, '_'))
    .filter((p) => p.length > 0);

  // Validate
  const invalidPhases = phases.filter((p) => !validatePhaseName(p));
  if (invalidPhases.length > 0) {
    console.log(`❌ Invalid phase names: ${invalidPhases.join(', ')}`);
    console.log('Phase names must be UPPER_SNAKE_CASE (letters and underscores only)\n');
    return promptForPhases(prompt);
  }

  // Check for reserved words
  const reserved = ['LOBBY', 'RULES'];
  const hasReserved = phases.some((p) => reserved.includes(p));
  if (hasReserved) {
    console.log('❌ Cannot use reserved phase names: LOBBY, RULES\n');
    return promptForPhases(prompt);
  }

  // Check for duplicates
  const uniquePhases = [...new Set(phases)];
  if (uniquePhases.length !== phases.length) {
    console.log('❌ Duplicate phase names detected\n');
    return promptForPhases(prompt);
  }

  // Add SETUP and GAME_OVER
  const finalPhases = ['SETUP', ...uniquePhases, 'GAME_OVER'];

  console.log(`✅ Phases: ${finalPhases.join(', ')}\n`);
  return finalPhases;
}

/**
 * Prompts for game actions
 * @param {Function} prompt - Prompt function
 * @returns {Promise<string[]>} Array of action names
 */
async function promptForActions(prompt) {
  console.log('📋 Actions Configuration');
  console.log('Enter player actions (comma-separated, e.g., "SUBMIT_CARD, SUBMIT_VOTES")');
  console.log('At least one action is required.\n');

  const input = await prompt('Actions: ');

  if (!input || input.trim() === '') {
    console.log('❌ At least one action is required\n');
    return promptForActions(prompt);
  }

  // Parse input
  const actions = input
    .split(',')
    .map((a) => a.trim().toUpperCase().replace(/\s+/g, '_'))
    .filter((a) => a.length > 0);

  // Validate
  const invalidActions = actions.filter((a) => !validateActionName(a));
  if (invalidActions.length > 0) {
    console.log(`❌ Invalid action names: ${invalidActions.join(', ')}`);
    console.log('Action names must be UPPER_SNAKE_CASE (letters and underscores only)\n');
    return promptForActions(prompt);
  }

  // Check for duplicates
  const uniqueActions = [...new Set(actions)];
  if (uniqueActions.length !== actions.length) {
    console.log('❌ Duplicate action names detected\n');
    return promptForActions(prompt);
  }

  console.log(`✅ Actions: ${uniqueActions.join(', ')}\n`);
  return uniqueActions;
}

/**
 * Prompts for player count range
 * @param {Function} prompt - Prompt function
 * @returns {Promise<{min: number, max: number}>} Player count range
 */
async function promptForPlayerCounts(prompt) {
  console.log('📋 Player Count Configuration\n');

  let min = 0;
  while (min < 2 || min > 10) {
    const input = await prompt('Enter minimum players (2-10, default 2): ');
    if (input === '') {
      min = 2;
      break;
    }
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 2 || num > 10) {
      console.log('❌ Minimum must be between 2 and 10\n');
    } else {
      min = num;
    }
  }

  let max = 0;
  while (max < min || max > 10) {
    const input = await prompt(`Enter maximum players (${min}-10, default 10): `);
    if (input === '') {
      max = 10;
      break;
    }
    const num = parseInt(input, 10);
    if (isNaN(num) || num < min || num > 10) {
      console.log(`❌ Maximum must be between ${min} and 10\n`);
    } else {
      max = num;
    }
  }

  console.log(`✅ Player count: ${min}-${max}\n`);
  return { min, max };
}

/**
 * Prompts for rounds configuration
 * @param {Function} prompt - Prompt function
 * @returns {Promise<{type: string, count: number}|null>} Rounds configuration or null
 */
async function promptForRounds(prompt) {
  console.log('📋 Rounds Configuration');
  console.log('Does the game have fixed rounds, max rounds, or no rounds?\n');

  let type = '';
  while (!['fixed', 'max', 'none'].includes(type)) {
    const input = await prompt('Enter "fixed", "max", or "none" (default: none): ');
    if (input === '') {
      type = 'none';
      break;
    }
    const normalized = input.toLowerCase().trim();
    if (['fixed', 'max', 'none'].includes(normalized)) {
      type = normalized;
    } else {
      console.log('❌ Please enter "fixed", "max", or "none"\n');
    }
  }

  if (type === 'none') {
    console.log('✅ No rounds configured\n');
    return null;
  }

  let count = 0;
  while (count < 1) {
    const input = await prompt(`Enter number of ${type === 'fixed' ? 'total' : 'maximum'} rounds: `);
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 1) {
      console.log('❌ Round count must be a positive number\n');
    } else {
      count = num;
    }
  }

  console.log(`✅ ${type === 'fixed' ? 'Total' : 'Max'} rounds: ${count}\n`);
  return { type, count };
}

/**
 * Displays a summary of all collected metadata
 * @param {Object} metadata - Game metadata
 */
function displayMetadataSummary(metadata) {
  const { gameName, gameCode, gameKey, phases, actions, playerCounts, rounds } = metadata;

  console.log('\n📋 Configuration Summary:');
  console.log(`   Game Name: ${gameName}`);
  console.log(`   Game Code: ${gameCode}`);
  console.log(`   Game Key:  ${gameKey}`);
  console.log(`   Phases:    ${phases.join(', ')}`);
  console.log(`   Actions:   ${actions.join(', ')}`);
  console.log(`   Players:   ${playerCounts.min}-${playerCounts.max}`);
  if (rounds) {
    console.log(`   Rounds:    ${rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS'} = ${rounds.count}`);
  } else {
    console.log('   Rounds:    None');
  }
  console.log();
}

module.exports = {
  promptForPhases,
  promptForActions,
  promptForPlayerCounts,
  promptForRounds,
  displayMetadataSummary,
};
