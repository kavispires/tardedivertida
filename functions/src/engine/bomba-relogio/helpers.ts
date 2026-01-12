// Constants
import { BOMBA_RELOGIO_PHASES } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, DECLARATION, EXAMINATION, GAME_OVER } = BOMBA_RELOGIO_PHASES;
  const order = [LOBBY, SETUP, DECLARATION, EXAMINATION, GAME_OVER];

  // TODO
  if (currentPhase === EXAMINATION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : DECLARATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return EXAMINATION;
};
