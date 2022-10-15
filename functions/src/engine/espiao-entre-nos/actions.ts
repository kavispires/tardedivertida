// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param locationId
 * @returns
 */
export const handleLastQuestioner = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  lastPlayerId: PlayerId
) => {
  return await utils.firebase.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'set last player to question',
    change: { lastPlayerId: lastPlayerId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param locationId
 * @returns
 */
export const handleGuessLocation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  locationId: string
) => {
  return await utils.firebase.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'attempt a spy guess',
    change: { guess: locationId },
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
export const handleMakeAccusation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  targetId: PlayerId
) => {
  return await utils.firebase.updateStore({
    gameName,
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
  vote: PlayerId
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
