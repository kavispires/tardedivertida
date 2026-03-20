// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPlanning = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluations: Dictionary<string>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluations',
    shouldReady: true,
    change: { evaluations },
    nextPhaseFunction: getNextPhase,
  });
};
