// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param locationId
 * @returns
 */
export const handleLastQuestioner = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  lastPlayerId: PlayerId
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'set last player to question',
    change: { lastPlayerId: lastPlayerId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param locationId
 * @returns
 */
export const handleGuessLocation = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  locationId: string
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'attempt a spy guess',
    change: { guess: locationId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleMakeAccusation = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  targetId: PlayerId
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'make accusation',
    change: {
      targetId,
      accuserId: playerId,
      pausedAt: Date.now(),
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
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
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
