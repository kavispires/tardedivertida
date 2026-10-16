/**
 * Generator for constants.ts file
 */

/**
 * Generates the contents of constants.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateConstants(metadata) {
  const { gameName, gameKey, phases, actions, playerCounts, rounds } = metadata;

  // Generate phases constant
  const phasesEntries = phases.map((phase) => `  /**
   * Identifier for the ${phase.toLowerCase().replace(/_/g, ' ')} phase.
   */
  ${phase}: '${phase}',`).join('\n');
  const phasesConstant = `/**
 * Phase identifiers used by the \`${gameName}\` engine.
 */
export const ${gameKey}_PHASES = {\n${phasesEntries}\n} as const;`;

  // Generate actions constant
  const actionsEntries = actions.map((action) => `  /**
   * Identifier for the ${action.toLowerCase().replace(/_/g, ' ')} player action.
   */
  ${action}: '${action}',`).join('\n');
  const actionsConstant = `/**
 * Player action identifiers accepted by the \`${gameName}\` engine.
 */
export const ${gameKey}_ACTIONS = {\n${actionsEntries}\n} as const;`;

  // Generate player counts constant
  const playerCountsConstant = `/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  /**
   * Minimum number of players required to start a session.
   */
  MIN: ${playerCounts.min},
  /**
   * Maximum number of players allowed in a session.
   */
  MAX: ${playerCounts.max},
} as const;`;

  // Generate rounds constant if present
  let roundsConstant = '';
  if (rounds) {
    const constantName = rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS';
    roundsConstant = `\n\n/**
 * ${rounds.type === 'fixed' ? 'The number of rounds played in a complete game.' : 'The maximum number of rounds before the game ends.'}
 */
export const ${constantName} = ${rounds.count};`;
  }

  return `${phasesConstant}\n\n${actionsConstant}\n\n${playerCountsConstant}${roundsConstant}\n`;
}

module.exports = {
  generateConstants,
};
