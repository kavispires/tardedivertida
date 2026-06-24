// Helpers
import { updatePlayer, updateState } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the category for evaluation
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the category
 * @param category - The category string
 */
export const handleSubmitCategory = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  category: string,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your category',
    change: { category },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Skips the current turn
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID skipping the turn
 */
export const handleSkipTurn = async (gameName: string, gameId: UID, playerId: UID) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'skip your turn',
    change: {
      skipTurn: true,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's selected cards for the category
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting cards
 * @param cardsIds - Array of selected card IDs
 */
export const handleSubmitCards = async (gameName: string, gameId: UID, playerId: UID, cardsIds: UID[]) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your cards',
    change: { playedCardsIds: cardsIds },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits evaluations of other players' card submissions
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting evaluations
 * @param evaluations - Dictionary of card evaluations
 */
export const handleEvaluations = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluations: Dictionary<boolean>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card evaluations',
    change: { evaluations },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};
