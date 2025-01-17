// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPlanning = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  planning: Dictionary<string>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your planning',
    shouldReady: true,
    change: { planning },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitPlacements = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  evaluations: Dictionary<string>,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluations',
    change: { evaluations },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleUpdatePlacement = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  evaluations: Dictionary<string>,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'update your placement',
    change: { evaluations },
  });
};
