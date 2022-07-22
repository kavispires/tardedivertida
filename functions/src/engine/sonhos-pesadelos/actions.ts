// Helpers
import * as utils from '../../utils';
// Internal
import { getNextPhase } from './index';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param dream
 * @returns
 */
export const handleSubmitDream = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  dream: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
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
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param votes
 * @returns
 */
export const handleSubmitVoting = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: StringDictionary
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};
