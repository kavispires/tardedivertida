// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * Submits the category for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the category
 * @param categoryId - The selected category ID
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
 * Submits the psychic's clue for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The psychic player ID submitting the clue
 * @param clue - The clue text
 */
export const handleSubmitClue = async (gameName: string, gameId: UID, playerId: UID, clue: string) => {
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
 * Submits each player's guess for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the guess
 * @param guess - The guess value (number or boolean)
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
