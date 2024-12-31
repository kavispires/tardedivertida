// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitRequest = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
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

export const handleStopDelivering = async (gameName: GameName, gameId: GameId, playerId: PlayerId) => {
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
