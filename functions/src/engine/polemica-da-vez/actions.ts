// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { getNextPhase } from '.';

/**
 * When active player chooses the round's topic
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param questionId
 * @returns
 */
export const handleSubmitTopic = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  topicId: string,
  customTopic?: string
) => {
  return await firebaseUtils.updateStore({
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
 * @param answers
 * @returns
 */
export const handleSubmitReaction = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  reaction: boolean,
  likesGuess: number
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { reaction, likesGuess },
    nextPhaseFunction: getNextPhase,
  });
};
