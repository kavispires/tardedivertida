// Helpers
import utils from '../../utils';
// Internal
import { getNextPhase } from './index';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param dream
 * @returns
 */
export const handleSubmitDream = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  dream: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your dream',
    shouldReady: true,
    change: { dream },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param votes
 * @returns
 */
export const handleSubmitVoting = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  votes: Dictionary<string>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};
