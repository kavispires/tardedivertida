// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
// Internal functions
import { getNextPhase } from './index';

/**
 * Update player with their sketch
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitSketch = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  sketch: string
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit sketch',
    shouldReady: true,
    change: { sketch },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Update player with their vote
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitVote = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
