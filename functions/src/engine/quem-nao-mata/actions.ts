// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitTarget = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  targetId: UID,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    shouldReady: true,
    change: { target: targetId },
  });
};

export const handleSubmitMessage = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  targetId: UID,
  recipientId?: UID,
) => {
  // Handle player
  await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'used message',
    change: { messaged: true },
    nextPhaseFunction: getNextPhase,
  });

  // Handle state
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit message',

    change: { [`messages.${playerId}`]: { targetId, recipientId: recipientId || 'ALL' } },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDecision = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  decision: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
