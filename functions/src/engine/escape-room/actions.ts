import { arrayUnion } from 'firebase/firestore';
// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles card submission for playing help or mission completion cards
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the card
 * @param cardId - The card ID being submitted
 */
export const handleSubmitCard = async (gameName: string, gameId: UID, playerId: UID, cardId: UID) => {
  // TODO: check if it's help or complete mission card and then use getNextPhase accordingly, cards Ids should be UIDs for those
  const isHelpCard = false; // Replace with actual check
  const isCompleteMissionCard = false; // Replace with actual check

  const shouldAdvancePhase = isHelpCard || isCompleteMissionCard;

  // If the played card is a help or complete mission card, we might want to trigger phase advancement
  const nextPhaseFunction = shouldAdvancePhase ? getNextPhase : undefined;

  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit play card',
    change: { played: arrayUnion(cardId) },
    nextPhaseFunction,
  });
};
