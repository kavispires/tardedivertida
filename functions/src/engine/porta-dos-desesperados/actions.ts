// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPages = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  pageIds: ImageCardId[]
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue pages',
    change: { selectedPagesIds: utils.game.shuffle(pageIds) },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDoor = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  doorId: ImageCardId,
  ready?: boolean
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your door',
    shouldReady: false,
    change: { doorId, ready: Boolean(ready) },
    nextPhaseFunction: getNextPhase,
  });
};
