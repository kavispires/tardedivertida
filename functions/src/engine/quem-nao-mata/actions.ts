// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitTarget = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  targetId: PlayerId
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    shouldReady: true,
    change: { target: targetId },
  });
};

export const handleSubmitMessage = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  targetId: PlayerId,
  recipientId?: PlayerId
) => {
  // Handle player
  await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'used message',
    change: { messaged: true },
    nextPhaseFunction: getNextPhase,
  });

  // Handle state
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit message',

    change: { [`messages.${playerId}`]: { targetId, recipientId: recipientId || 'ALL' } },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDecision = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  decision: string
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
