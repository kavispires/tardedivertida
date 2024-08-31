// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits card
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handleSubmitCard = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: CardId
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card',
    shouldReady: true,
    change: {
      cardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits card guess
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitCardGuess = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: CardId[]
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit non-robot cards',
    shouldReady: true,
    change: {
      guess,
    },
    nextPhaseFunction: getNextPhase,
  });
};
