// Types
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { getNextPhase } from '.';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param votes
 * @returns
 */
export const handleSubmitWordSelectionVotes = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: PlainObject
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your word selection votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param suggestions
 * @returns
 */
export const handleSubmitSuggestions = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  suggestions: PlainObject
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your suggestions',
    shouldReady: true,
    change: { suggestions },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param validSuggestions
 * @returns
 */
export const handleSubmitValidation = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  validSuggestions: PlainObject
) => {
  return await firebaseUtils.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the suggestions validation',
    change: {
      validSuggestions,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param outcome
 * @returns
 */
export const handleConfirmGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  outcome: string
) => {
  return await firebaseUtils.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'confirm guess',
    change: {
      outcome,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param suggestions
 * @returns
 */
export const handleUpdateValidSuggestions = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  suggestions: PlainObject
) => {
  return await firebaseUtils.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'update valid suggestions',
    change: {
      suggestions,
    },
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSendGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: string
) => {
  return await firebaseUtils.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'send guess',
    change: {
      guess,
    },
  });
};
