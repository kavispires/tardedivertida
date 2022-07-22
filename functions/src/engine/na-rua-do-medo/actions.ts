// Types
import type { Decisions } from './types';
// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitDecision = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  decision: Decisions
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
