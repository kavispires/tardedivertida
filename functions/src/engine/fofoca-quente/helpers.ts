import utils from '../../utils';
// Constants
import { FOFOCA_QUENTE_PHASES } from './constants';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  nextPhase?: keyof typeof FOFOCA_QUENTE_PHASES,
): string => {
  const {
    RULES,
    SETUP,
    ROLES_SELECTION,
    BOARD_SETUP,
    INTIMIDATION,
    RUMOR,
    RESPONSE,
    INVESTIGATION,
    SCHOOL,
    RESOLUTION,
    GAME_OVER,
  } = FOFOCA_QUENTE_PHASES;
  const order = [
    RULES,
    SETUP,
    ROLES_SELECTION,
    BOARD_SETUP,
    INTIMIDATION,
    RUMOR,
    RESPONSE,
    INVESTIGATION,
    SCHOOL,
    RESOLUTION,
    GAME_OVER,
  ];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : nextPhase || INTIMIDATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return INTIMIDATION;
};
