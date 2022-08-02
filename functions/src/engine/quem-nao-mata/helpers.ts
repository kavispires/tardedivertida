import { MAX_ROUNDS, QUEM_NAO_MATA_PHASES } from './constants';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, TARGETING, STANDOFF, DUEL, RESOLUTION, GAME_OVER } = QUEM_NAO_MATA_PHASES;
  const order = [RULES, SETUP, TARGETING, STANDOFF, DUEL, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    if (round.total === MAX_ROUNDS || triggerLastRound) {
      return GAME_OVER;
    }

    // TODO: If someone reached the threshold

    return TARGETING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TARGETING;
};
