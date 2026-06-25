// Constants
import { PLANEJAMENTO_URBANO_PHASES } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, PLANNING, PLACING, RESOLUTION, GAME_OVER } = PLANEJAMENTO_URBANO_PHASES;
  const order = [SETUP, PLANNING, PLACING, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : PLANNING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};
