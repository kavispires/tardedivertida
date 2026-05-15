// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's selected cards for the robot test
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting cards
 * @param cardIds - Array of selected card IDs
 */
export const handleSubmitCards = async (gameName: string, gameId: UID, playerId: UID, cardIds: UID[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card',
    shouldReady: true,
    change: {
      cardIds,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's guess identifying non-robot cards
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the guess
 * @param guess - Array of card IDs guessed as non-robot
 */
export const handleSubmitCardGuess = async (gameName: string, gameId: UID, playerId: UID, guess: UID[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit non-robot cards',
    shouldReady: true,
    change: {
      guess,
    },
    nextPhaseFunction: getNextPhase,
  });
};
