// Helpers
import utils from '../../utils';
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  lastPlayerId: UID,
) => {
  return await utils.firestore.updateStore({
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  locationId: string,
) => {
  return await utils.firestore.updateStore({
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
export const handleMakeAccusation = async (gameName: string, gameId: UID, playerId: UID, targetId: UID) => {
  return await utils.firestore.updateStore({
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
export const handleSubmitVote = async (gameName: string, gameId: UID, playerId: UID, vote: UID) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
