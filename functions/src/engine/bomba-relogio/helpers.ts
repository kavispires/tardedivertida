// Constants
import { BOMBA_RELOGIO_PHASES, OUTCOME } from './constants';
// Utils
import utils from '../../utils';
import type { Status } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, status: Status): string => {
  const { LOBBY, SETUP, DECLARATION, EXAMINATION, GAME_OVER } = BOMBA_RELOGIO_PHASES;
  const order = [LOBBY, SETUP, DECLARATION, EXAMINATION, GAME_OVER];

  if (currentPhase === EXAMINATION) {
    if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
      return GAME_OVER;
    }

    return status.outcome === OUTCOME.END ? DECLARATION : EXAMINATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return EXAMINATION;
};
