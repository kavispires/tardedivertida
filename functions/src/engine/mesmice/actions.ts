// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's selected object and clue
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the object
 * @param itemId - The selected item ID
 * @param clue - The clue text for the object
 */
export const handleSubmitObject = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  itemId: UID,
  clue: string,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your object',
    shouldReady: true,
    change: { selectedItemId: itemId, clue },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's selected feature to eliminate
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID eliminating a feature
 * @param featureId - The feature ID to eliminate
 */
export const handleSubmitFeature = async (gameName: string, gameId: UID, playerId: UID, featureId: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your eliminated feature',
    shouldReady: true,
    change: { selectedFeatureId: featureId },
    nextPhaseFunction: getNextPhase,
  });
};
