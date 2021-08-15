import * as gameUtils from '../../utils/game-utils';
import { PlainObject, PlayerId, Players } from '../../utils/interfaces';
import { MAX_NUMBER_OF_ROUNDS, TESTEMUNHA_OCULAR_PHASES } from './constants';
import { TestemunhaOcularCard, TestemunhaOcularCardsDatabase, TestemunhaOcularEntry } from './interfaces';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  lose?: boolean,
  win?: boolean
): string => {
  const {
    RULES,
    SETUP,
    WITNESS_SELECTION,
    QUESTION_SELECTION,
    QUESTIONING,
    TRIAL,
    GAME_OVER,
  } = TESTEMUNHA_OCULAR_PHASES;
  const order = [RULES, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL];

  if (currentPhase === TRIAL && (lose || win)) {
    return GAME_OVER;
  }

  if (currentPhase === TRIAL) {
    return currentRound >= MAX_NUMBER_OF_ROUNDS ? GAME_OVER : QUESTION_SELECTION;
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
 * @param witness
 * @returns
 */
export const determineTurnOrder = (players: Players, witness: PlayerId): PlayerId[] => {
  const availablePlayers = Object.keys(players).filter((id) => id !== witness);
  return gameUtils.shuffle(availablePlayers);
};

/**
 * Gets the round questioner
 * @param turnOrder
 * @param questionerIndex
 * @returns
 */
export const getQuestioner = (turnOrder: PlayerId[], questionerIndex: number): PlayerId => {
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

export const buildUsedCardsIdsDict = (pastQuestions: TestemunhaOcularEntry[]): PlainObject => {
  return pastQuestions.reduce((acc, question) => {
    acc[question.id] = true;
    return acc;
  }, {});
};
