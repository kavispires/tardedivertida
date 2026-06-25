// Constants
import { MAX_ROUNDS, QUEM_NAO_MATA_PHASES } from './constants';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, TARGETING, STANDOFF, DUEL, RESOLUTION, GAME_OVER } = QUEM_NAO_MATA_PHASES;
  const order = [SETUP, TARGETING, STANDOFF, DUEL, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    if (round.total === MAX_ROUNDS || round.forceLastRound) {
      return GAME_OVER;
    }

    // TODO: If someone reached the threshold

    return TARGETING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};
