// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitTarget = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  target: PlayerId
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your target',
    shouldReady: true,
    change: { target },
  });
};

export const handleSubmitMessage = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  message: any
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit message',

    change: { message },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDecision = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  decision: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
