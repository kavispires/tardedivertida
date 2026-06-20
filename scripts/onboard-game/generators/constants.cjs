/**
 * Generator for constants.ts file
 */

/**
 * Generates the contents of constants.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateConstants(metadata) {
  const { gameKey, phases, actions, playerCounts, rounds } = metadata;

  // Generate phases constant
  const phasesEntries = phases.map((phase) => `  ${phase}: '${phase}',`).join('\n');
  const phasesConstant = `export const ${gameKey}_PHASES = {\n${phasesEntries}\n} as const;`;

  // Generate actions constant
  const actionsEntries = actions.map((action) => `  ${action}: '${action}',`).join('\n');
  const actionsConstant = `export const ${gameKey}_ACTIONS = {\n${actionsEntries}\n} as const;`;

  // Generate player counts constant
  const playerCountsConstant = `export const PLAYER_COUNTS = {\n  MIN: ${playerCounts.min},\n  MAX: ${playerCounts.max},\n} as const;`;

  // Generate rounds constant if present
  let roundsConstant = '';
  if (rounds) {
    const constantName = rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS';
    roundsConstant = `\n\nexport const ${constantName} = ${rounds.count};`;
  }

  return `${phasesConstant}\n\n${actionsConstant}\n\n${playerCountsConstant}${roundsConstant}\n`;
}

module.exports = {
  generateConstants,
};
