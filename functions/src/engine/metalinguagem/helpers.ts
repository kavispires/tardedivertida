// Utils
import utils from '../../utils';
import { METALINGUAGEM_PHASES, WORD_LENGTH_STATUS } from './constants';
import type { WordLength } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, wordLengths: WordLength[]): string => {
  const { RULES, SETUP, WORD_CREATION, GUESSING, RESULTS, GAME_OVER } = METALINGUAGEM_PHASES;
  const order = [RULES, SETUP, WORD_CREATION, GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    if (round.forceLastRound) return GAME_OVER;
    if (round.current > 0 && round.current === round.total) return GAME_OVER;
    // Instant death if any word is failed
    if (wordLengths.some((wordLength) => wordLength.status === WORD_LENGTH_STATUS.FAILED)) return GAME_OVER;
    // If there's still available or endangered words, go back to word creation
    if (
      wordLengths.some(
        (wordLength) =>
          wordLength.status === WORD_LENGTH_STATUS.AVAILABLE ||
          wordLength.status === WORD_LENGTH_STATUS.ENDANGERED,
      )
    )
      return WORD_CREATION;

    return GAME_OVER;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return WORD_CREATION;
};
