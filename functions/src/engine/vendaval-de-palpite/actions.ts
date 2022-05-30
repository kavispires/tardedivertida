// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param masterId
 * @returns
 */
export const handleSubmitMasterPlayer = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  masterId: string
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit master player id',
    change: {
      masterId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param secretWord
 * @param categories
 * @returns
 */
export const handleSubmitSecretWord = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  secretWord: string,
  categories: string[]
) => {
  return await utils.firebase.updateState({
    collectionName,
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
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param clues
 * @param guess
 * @returns
 */
export const handleSubmitPlayerClues = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clues: string[],
  guesses?: string[]
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
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
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param evaluation
 * @returns
 */
export const handleSubmitEvaluation = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  evaluation: number
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit evaluation',
    change: {
      currentEvaluation: evaluation,
    },
    nextPhaseFunction: getNextPhase,
  });
};

// TODO: SUBMIT_FAIL
/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param outcome
 * @returns
 */
export const handleSubmitOutcome = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  outcome: string
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit outcome',
    change: {
      outcome,
    },
    nextPhaseFunction: getNextPhase,
  });
};

// TODO: SUBMIT_HELP
/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param clue
 * @param evaluation
 * @returns
 */
export const handleSubmitHelp = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string,
  evaluation: string
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit help',
    change: {
      usedHelper: false,
      help: { [clue]: evaluation },
    },
    nextPhaseFunction: getNextPhase,
  });
};
