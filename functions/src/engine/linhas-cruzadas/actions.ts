// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param promptId
 * @returns
 */
export const handleSubmitPrompt = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  promptId: string,
  randomSelection = false,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit prompt',
    shouldReady: true,
    change: { promptId, randomSelection },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param drawing
 * @returns
 */
export const handleSubmitDrawing = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  drawing: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit drawing',
    shouldReady: true,
    change: { drawing },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitGuess = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guess: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { guess },
    nextPhaseFunction: getNextPhase,
  });
};
