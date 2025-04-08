// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCard = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: CardId,
  targetId: PlayerId,
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
