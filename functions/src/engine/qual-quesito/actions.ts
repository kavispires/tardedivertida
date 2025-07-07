// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCategory = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
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

export const handleSkipTurn = async (gameName: GameName, gameId: GameId, playerId: PlayerId) => {
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

export const handleSubmitCards = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardsIds: CardId[],
) => {
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

export const handleRejectCards = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardsIds: CardId[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'reject the cards',
    change: { rejectedCards: cardsIds },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};
