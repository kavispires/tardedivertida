import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { Declaration, Target } from './types';

export const handleSubmitDeclarations = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  targetPlayerId: UID,
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  target: Target,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    change: {
      [`status.cut.${target.targetCardIndex}`]: target.targetCard,
      [`status.activePlayerIds.${target.playerIndex}`]: target.playerId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
