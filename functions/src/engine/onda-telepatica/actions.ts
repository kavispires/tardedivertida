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
 * @param guess
 * @returns
 */
export const handleSubmitCategory = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  categoryId: string
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit category',
    change: {
      currentCategoryId: categoryId,
    },
  });
};

/**
 * When psychic submits the round's clue
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param categoryId
 * @param clue
 * @returns
 */
export const handleSubmitClue = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit clue',
    change: {
      clue,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * When each player submit their round's guess
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
  guess: number | boolean
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
