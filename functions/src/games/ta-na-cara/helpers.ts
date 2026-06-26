// Types
import type { TaNaCaraState } from './types';
// Constants
import { TA_NA_CARA_PHASES } from './constants';
// Mechanics
import { nextPhaseDelegator } from '../../mechanics/session';

/**
 * Determine the next phase based on the current one
 * @param state - The current state of the game
 * @param store - The Firebase store data
 */
export const determineNextPhase = (state: TaNaCaraState): string => {
  const { SETUP, PROMPT, ANSWERING, GUESSING, GAME_OVER } = TA_NA_CARA_PHASES;
  const order = [SETUP, PROMPT, ANSWERING, GUESSING, GAME_OVER];

  const { phase: currentPhase, round, triggerGuessing = false } = state;

  if (currentPhase === PROMPT) {
    if (triggerGuessing) {
      return GUESSING;
    }

    return round.forceLastRound || (round.current > 0 && round.current) === round.total
      ? GAME_OVER
      : ANSWERING;
  }

  if (currentPhase === ANSWERING) {
    return PROMPT;
  }

  if (currentPhase === GUESSING) {
    return GAME_OVER;
  }

  return nextPhaseDelegator(currentPhase, order);
};
