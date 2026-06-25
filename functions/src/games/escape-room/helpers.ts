// Types
import type { Outcome } from './types';
// Constants
import { ESCAPE_ROOM_PHASES } from './constants';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the mission
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: Outcome): string => {
  const { SETUP, MISSION, MISSION_EVALUATION, RESULTS, GAME_OVER } = ESCAPE_ROOM_PHASES;
  const order = [SETUP, MISSION, MISSION_EVALUATION, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    // If the game over was forced, end the game
    if (round.forceLastRound) {
      return GAME_OVER;
    }
    // Otherwise, resolve by outcome
    if (outcome === 'WIN' || outcome === 'LOSE') {
      return GAME_OVER;
    }
    return MISSION;
  }

  // TODO: handle mission evaluation for help card (maybe create a help phase?)

  return utils.game.nextPhaseDelegator(currentPhase, order);
};
