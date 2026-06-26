// Types
import type { WordLength } from './types';
// Constants
import { METALINGUAGEM_PHASES, WORD_LENGTH_STATUS } from './constants';
// Mechanics
import { nextPhaseDelegator } from '../../mechanics/session';

/**
 * Determines the next phase based on the current phase and word lengths
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param wordLengths - The array of word lengths with their statuses
 */
export const determineNextPhase = (currentPhase: string, round: Round, wordLengths: WordLength[]): string => {
  const { SETUP, WORD_CREATION, GUESSING, RESULTS, GAME_OVER } = METALINGUAGEM_PHASES;
  const order = [SETUP, WORD_CREATION, GUESSING, RESULTS, GAME_OVER];

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

  return nextPhaseDelegator(currentPhase, order);
};
