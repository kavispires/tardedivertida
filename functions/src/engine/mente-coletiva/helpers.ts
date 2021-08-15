// Constants
import { MAX_NUMBER_OF_ROUNDS, MENTE_COLETIVA_PHASES, QUESTIONS_PER_ROUND } from './constants';
// Interfaces
import { AllQuestions, Deck } from './interfaces';
// Utils
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (currentPhase: string, currentRound: number, end?: boolean): string => {
  const {
    RULES,
    SETUP,
    QUESTION_SELECTION,
    EVERYBODY_WRITES,
    COMPARE,
    RESOLUTION,
    GAME_OVER,
  } = MENTE_COLETIVA_PHASES;
  const order = [RULES, SETUP, QUESTION_SELECTION, EVERYBODY_WRITES, COMPARE, RESOLUTION];

  if (end || currentRound === MAX_NUMBER_OF_ROUNDS) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    return QUESTION_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return QUESTION_SELECTION;
};

/**
 * Determines the round type based on player count and current round number
 * @param playerCount
 * @param currentRound
 * @returns
 */
export const determineRoundType = (playerCount: number, currentRound: number): number => {
  if (currentRound < 3) return 1;

  if (currentRound > 11) {
    return gameUtils.getRandomItem([2, 2, 3]);
  }

  if (playerCount < 3) {
    return gameUtils.getRandomItem([1, 1, 1, 1, 1, 2, 0]);
  }

  return gameUtils.getRandomItem([1, 1, 1, 1, 2, 2, 3, 0]);
};

/**
 * Gets 3 unique questions per round
 * @param allQuestions
 * @param pastQuestionsIds
 * @returns
 */
export const buildDeck = (allQuestions: AllQuestions, pastQuestionsIds: string[]): Deck => {
  const neededQuestionsAmount = MAX_NUMBER_OF_ROUNDS * QUESTIONS_PER_ROUND;

  const filteredQuestions = Object.values(allQuestions).filter(({ id }) => !pastQuestionsIds.includes(id));

  const availableQuestions =
    filteredQuestions.length > neededQuestionsAmount ? filteredQuestions : Object.values(allQuestions);

  const shuffledQuestions = gameUtils.shuffle(availableQuestions);

  return shuffledQuestions.slice(0, neededQuestionsAmount + 1);
};
