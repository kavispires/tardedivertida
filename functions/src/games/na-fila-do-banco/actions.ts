// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the card to a specific teller
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the card
 * @param cardId - The card that the player wants to play
 * @param tellerId - The teller where the card will be placed
 * @param newCardId - The card that will replace the current card in the teller
 */
export const handleSubmitCard = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  cardId: UID,
  tellerId: UID,
  newCardId: UID,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card to teller',
    shouldReady: true,
    change: {
      selectedTellerId: tellerId,
      selectedCardId: cardId,
      selectedNewCardId: newCardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
