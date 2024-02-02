import { TestimonyQuestionCard } from '../../types/tdr';
// Constants
import { MAX_ROUNDS, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Utils
import utils from '../../utils';

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
  round: Round,
  lose?: boolean,
  win?: boolean
): string => {
  const { RULES, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL, GAME_OVER } =
    TESTEMUNHA_OCULAR_PHASES;
  const order = [RULES, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL];

  if (currentPhase === TRIAL && (lose || win)) {
    return GAME_OVER;
  }

  if (currentPhase === TRIAL) {
    return round.forceLastRound || round.current >= MAX_ROUNDS ? GAME_OVER : QUESTION_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return QUESTION_SELECTION;
};

/**
 * Determine turn order by shuffling players, excluding the witness
 * @param players
 * @param witnessId
 * @returns
 */
export const determineTurnOrder = (players: Players, witnessId: PlayerId): PlayerId[] => {
  const availablePlayers = utils.players.getListOfPlayersIds(players).filter((id) => id !== witnessId);
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
  questions: TestimonyQuestionCard[],
  questionIndex: number
): TestimonyQuestionCard[] => {
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
