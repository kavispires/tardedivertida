// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param categoryId
 * @returns
 */
export const handleSubmitCategory = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  categoryId: string,
) => {
  return await utils.firestore.updateState({
    gameName,
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
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clue
 * @returns
 */
export const handleSubmitClue = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  clue: string,
) => {
  return await utils.firestore.updateStore({
    gameName,
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
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitGuess = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guess: number | boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { guess },
    nextPhaseFunction: getNextPhase,
  });
};
