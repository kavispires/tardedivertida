// Types
import { PlayerId, Players } from '../../utils/types';
import { TestemunhaOcularCard, TestemunhaOcularCardsDatabase } from './types';
// Constants
import { MAX_ROUNDS, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Utils
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @param lose
 * @param win
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  lose?: boolean,
  win?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL, GAME_OVER } =
    TESTEMUNHA_OCULAR_PHASES;
  const order = [RULES, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL];

  if (currentPhase === TRIAL && (lose || win)) {
    return GAME_OVER;
  }

  if (currentPhase === TRIAL) {
    return triggerLastRound || currentRound >= MAX_ROUNDS ? GAME_OVER : QUESTION_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return QUESTION_SELECTION;
};

/**
 * Filters used cards off the deck
 * @param fullDeck
 * @param usedCardsIds
 * @returns
 */
export const filterAvailableCards = (
  fullDeck: TestemunhaOcularCardsDatabase,
  usedCardsIds: string[]
): TestemunhaOcularCard[] => {
  return Object.values(fullDeck).filter((entry) => !usedCardsIds.includes(entry.id));
};

/**
 * Determine turn order by shuffling players, excluding the witness
 * @param players
 * @param witnessId
 * @returns
 */
export const determineTurnOrder = (players: Players, witnessId: PlayerId): PlayerId[] => {
  const availablePlayers = Object.keys(players).filter((id) => id !== witnessId);
  return utils.game.shuffle(availablePlayers);
};

/**
 * Gets the round questioner
 * @param turnOrder
 * @param questionerIndex
 * @returns
 */
export const getQuestionerId = (turnOrder: PlayerId[], questionerIndex: number): PlayerId => {
  return turnOrder[questionerIndex % turnOrder.length];
};

/**
 * Get two questions from the deck
 * @param questions
 * @param questionIndex
 * @returns
 */
export const getQuestions = (
  questions: TestemunhaOcularCard[],
  questionIndex: number
): TestemunhaOcularCard[] => {
  return [questions[questionIndex], questions[questionIndex + 1]];
};

/**
 * Calculates round score
 * @param currentScore
 * @param currentRound
 * @param eliminatedSuspectsCount
 * @returns
 */
export const calculateScore = (
  currentScore: number,
  currentRound: number,
  eliminatedSuspectsCount: number
): number => {
  if (currentRound === 0) return 0;

  return currentScore + currentRound * eliminatedSuspectsCount;
};
