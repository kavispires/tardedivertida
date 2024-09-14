// Types
import type { Decisions } from './types';
// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitDecision = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  decision: Decisions
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
