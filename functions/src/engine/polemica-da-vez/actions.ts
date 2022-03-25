// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * When active player chooses the round's topic
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param topicId
 * @param customTopic
 * @returns
 */
export const handleSubmitTopic = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  topicId: string,
  customTopic?: string
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the question',
    change: {
      topicId,
      customTopic: customTopic ?? null,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * When each player submit their round's reaction and likes guess
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param reaction
 * @param likesGuess
 * @returns
 */
export const handleSubmitReaction = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  reaction: boolean,
  likesGuess: number
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { reaction, likesGuess },
    nextPhaseFunction: getNextPhase,
  });
};
