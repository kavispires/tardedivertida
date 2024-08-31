// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitObject = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  itemId: CardId,
  clue: string
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  featureId: CardId
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
