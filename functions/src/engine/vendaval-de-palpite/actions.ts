// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import { ClueId } from './types';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param bossId
 * @returns
 */
export const handleSubmitBossPlayer = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  bossId: string
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit boss player id',
    change: {
      bossId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param secretWord
 * @param categories
 * @returns
 */
export const handleSubmitSecretWord = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  secretWord: string,
  categories: string[]
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit secret word and categories',
    change: {
      secretWord,
      categories,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clues
 * @param guesses
 * @returns
 */
export const handleSubmitPlayerClues = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clues: string[],
  guesses?: string[]
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit clues',
    shouldReady: true,
    change: { clues, guesses },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param evaluation
 * @returns
 */
export const handleSubmitEvaluation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  evaluation: Record<ClueId, boolean>
) => {
  // Count trues
  const trues = Object.values(evaluation).filter((result) => result).length;

  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit evaluation',
    change: {
      currentEvaluation: trues,
      currentClues: evaluation,
    },
    nextPhaseFunction: getNextPhase,
  });
};

// TODO: SUBMIT_FAIL
/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param outcome
 * @returns
 */
export const handleSubmitOutcome = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  outcome: string
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit outcome',
    change: {
      outcome,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clueId
 * @returns
 */
export const handleSubmitHelp = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clueId: ClueId
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit help',
    change: {
      usedHelper: true,
      [`clues.${clueId}.isResolved`]: true,
    },
    nextPhaseFunction: getNextPhase,
  });
};
