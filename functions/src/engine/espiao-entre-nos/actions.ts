// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Sets the last player to question before accusations
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID setting the last questioner
 * @param lastPlayerId - The ID of the last player to question
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
 * Handles spy's guess for the location
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID making the guess
 * @param locationId - The guessed location ID
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
 * Handles making an accusation against another player
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID making the accusation
 * @param targetId - The ID of the accused player
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
