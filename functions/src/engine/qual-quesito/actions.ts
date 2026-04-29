// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCategory = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  category: string,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your category',
    change: { category },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSkipTurn = async (gameName: string, gameId: UID, playerId: UID) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'skip your turn',
    change: {
      skipTurn: true,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitCards = async (gameName: string, gameId: UID, playerId: UID, cardsIds: UID[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your cards',
    change: { playedCardsIds: cardsIds },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};

export const handleEvaluations = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluations: Dictionary<boolean>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card evaluations',
    change: { evaluations },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};
