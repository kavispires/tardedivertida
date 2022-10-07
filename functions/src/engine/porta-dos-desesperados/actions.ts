// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPages = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  pageIds: ImageCardId[]
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your clue pages',
    change: { selectedPagesIds: utils.game.shuffle(pageIds) },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDoor = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  doorId: ImageCardId,
  ready?: boolean
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your door',
    shouldReady: false,
    change: { doorId, ready: Boolean(ready) },
    nextPhaseFunction: getNextPhase,
  });
};
