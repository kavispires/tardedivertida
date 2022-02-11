// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
// Internal functions
import { getNextPhase } from './index';
import { Decisions } from './types';

export const handleSubmitDecision = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  decision: Decisions
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
