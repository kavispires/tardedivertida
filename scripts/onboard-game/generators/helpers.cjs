/**
 * Generator for helpers.ts file
 */

const { phaseToPascalCase } = require('../utils.cjs');

/**
 * Generates the contents of helpers.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateHelpers(metadata) {
  const { gameKey, phases, rounds } = metadata;

  const middlePhases = phases.filter((p) => p !== 'SETUP' && p !== 'GAME_OVER');
  const phasesCommaSeparated = middlePhases.join(', ');
  const lastMiddlePhase = middlePhases[middlePhases.length - 1];
  const firstMiddlePhase = middlePhases[0];

  // Conditional round-checking logic
  const roundCheckLogic = rounds
    ? `
  // Check if game should end after last round
  if (currentPhase === ${lastMiddlePhase}) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : ${firstMiddlePhase};
  }
`
    : '';

  return `// Constants
import { ${gameKey}_PHASES } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, ${phasesCommaSeparated}, GAME_OVER } = ${gameKey}_PHASES;
  const order = [SETUP, ${phasesCommaSeparated}, GAME_OVER];
${roundCheckLogic}
  return utils.game.nextPhaseDelegator(currentPhase, order);
};
`;
}

module.exports = {
  generateHelpers,
};
