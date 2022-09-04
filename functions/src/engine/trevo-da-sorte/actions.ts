// Utils
import * as utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param cardsIds
 * @returns
 */
export const handleSubmitBadWords = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardsIds: CardId[]
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit bad words',
    shouldReady: true,
    change: { badWordsIds: cardsIds },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param clues
 * @returns
 */
export const handleSubmitClues = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clues: string[]
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit clues',
    shouldReady: true,
    change: { 'clover.clues': clues },
    nextPhaseFunction: getNextPhase,
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
export const handleSubmitGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: any
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { guess },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param changes
 * @returns
 */
export const handleUpdateCloverState = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  changes: any
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'update clover state',
    change: { changes },
  });
};
