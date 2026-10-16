/**
 * Generator for helpers.ts file
 */

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
// Mechanics
import { nextPhaseDelegator } from '../../mechanics/session';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param ${rounds ? 'round' : '_round'} - The round object containing current round information
 * @returns The identifier of the next phase in the game sequence.
 */
export const determineNextPhase = (currentPhase: string, ${rounds ? 'round' : '_round'}: Round): string => {
  const { SETUP, ${phasesCommaSeparated}, GAME_OVER } = ${gameKey}_PHASES;
  const order = [SETUP, ${phasesCommaSeparated}, GAME_OVER];
${roundCheckLogic}
  return nextPhaseDelegator(currentPhase, order);
};
`;
}

module.exports = {
  generateHelpers,
};
