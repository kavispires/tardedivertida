// Helpers
import utils from '../../utils';
import { shuffle } from 'lodash';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the selected clue pages for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting pages
 * @param pageIds - Array of selected page IDs
 */
export const handleSubmitPages = async (gameName: string, gameId: UID, playerId: UID, pageIds: UID[]) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue pages',
    change: { selectedPagesIds: shuffle(pageIds) },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's door selection
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the door
 * @param doorId - The selected door ID
 * @param [ready] - Whether the player is ready to proceed
 */
export const handleSubmitDoor = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  doorId: UID,
  ready?: boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your door',
    shouldReady: false,
    change: { doorId, ready: Boolean(ready) },
    nextPhaseFunction: getNextPhase,
  });
};
