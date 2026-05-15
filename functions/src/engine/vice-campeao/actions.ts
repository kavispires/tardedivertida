// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's card and target selection
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the card
 * @param cardId - The selected card ID
 * @param targetId - The target player ID
 */
export const handleSubmitCard = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  cardId: UID,
  targetId: UID,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit target',
    shouldReady: true,
    change: {
      selectedCardId: cardId,
      selectedTargetId: targetId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
