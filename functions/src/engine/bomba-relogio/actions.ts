// Helpers
import { arrayUnion } from 'firebase/firestore';
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { Declaration, Target } from './types';

export const handleSubmitDeclarations = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  declarations: Declaration,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the declarations',
    shouldReady: true,
    change: { declarations },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleUpdateTargetPlayer = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  targetPlayerId: PlayerId,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'update target player',
    change: {
      currentTargetPlayerId: targetPlayerId,
    },
  });
};

export const handleSubmitTarget = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  target: Target,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    change: {
      'status.cut': arrayUnion(target.targetCard),
      'status.activePlayerIds': arrayUnion(target.playerId),
    },
    nextPhaseFunction: getNextPhase,
  });
};
