// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitRequest = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  clue: string,
  clueQuantity: number,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    shouldGoToNextPhase: true,
    change: { clue, clueQuantity },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDelivery = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  delivery: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your delivery',
    shouldReady: true,
    shouldGoToNextPhase: true,
    change: { delivery },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleStopDelivering = async (gameName: string, gameId: UID, playerId: UID) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'stop delivering',
    shouldReady: true,
    shouldGoToNextPhase: true,
    change: { stopDelivery: true },
    nextPhaseFunction: getNextPhase,
  });
};
