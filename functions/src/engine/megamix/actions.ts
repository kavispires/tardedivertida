// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's seeds data for the challenge
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting seeds
 * @param data - The seeds data object
 */
export const handleSubmitSeeds = async (gameName: string, gameId: UID, playerId: UID, data: PlainObject) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit seeds',
    shouldReady: true,
    change: { data },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's answer for the track challenge
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the answer
 * @param data - The track answer data object
 */
export const handleSubmitTrackAnswer = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  data: PlainObject,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit track answer',
    shouldReady: true,
    change: { data },
    nextPhaseFunction: getNextPhase,
  });
};
