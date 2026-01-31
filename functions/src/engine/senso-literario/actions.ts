// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPattern = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  patternId: CardId,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the pattern',
    shouldReady: true,
    change: { patternId },
    nextPhaseFunction: getNextPhase,
  });
};
