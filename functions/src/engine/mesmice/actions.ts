// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitObject = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  itemId: UID,
  clue: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your object',
    shouldReady: true,
    change: { selectedItemId: itemId, clue },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitFeature = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  featureId: UID,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your eliminated feature',
    shouldReady: true,
    change: { selectedFeatureId: featureId },
    nextPhaseFunction: getNextPhase,
  });
};
