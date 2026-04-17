// Helpers
import utils from '../../utils';
import { shuffle } from 'lodash';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPages = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  pageIds: UID[],
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue pages',
    change: { selectedPagesIds: shuffle(pageIds) },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDoor = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  doorId: UID,
  ready?: boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your door',
    shouldReady: false,
    change: { doorId, ready: Boolean(ready) },
    nextPhaseFunction: getNextPhase,
  });
};
