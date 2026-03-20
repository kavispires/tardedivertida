// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

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
