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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  categoryId: string
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: number | boolean
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
