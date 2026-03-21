// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the card
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId - the card that the player wants to play, it can be a card from their hand or a card that is already in a teller if they want to move it to another teller
 * @param tellerId - the teller where the card will be placed, it can be the same as the current teller of the card if the player is just moving a card from one teller to another without playing a card from their hand
 * @param newCardId - the card that will be placed in the teller after the move, it can be the same as cardId if the player is just moving a card from one teller to another without playing a card from their hand
 * @returns
 */
export const handleSubmitCard = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  cardId: UID,
  tellerId: UID,
  newCardId: UID,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card to teller',
    shouldReady: true,
    change: {
      cardId,
      tellerId,
      newCardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
