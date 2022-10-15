// Helpers
import * as utils from '../../utils';
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  dream: string
) => {
  return await utils.firebase.updatePlayer({
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: StringDictionary
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};
