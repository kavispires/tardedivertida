// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from './index';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handleSubmitStory = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  story: string,
  cardId: string,
) => {
  await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit story',
    shouldReady: true,
    change: {
      story,
      cardId,
      vote: cardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handlePlayCard = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string,
) => {
  const actionText = 'play a card';

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: {
      cardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitVote = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
  });
};
