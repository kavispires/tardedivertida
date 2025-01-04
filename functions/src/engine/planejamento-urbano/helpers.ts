// Constants
import { PLANEJAMENTO_URBANO_PHASES } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, PLANNING, PLACING, RESOLUTION, GAME_OVER } = PLANEJAMENTO_URBANO_PHASES;
  const order = [RULES, SETUP, PLANNING, PLACING, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : PLANNING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return PLANNING;
};
