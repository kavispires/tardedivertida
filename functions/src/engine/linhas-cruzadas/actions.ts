// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param promptId
 * @returns
 */
export const handleSubmitPrompt = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  promptId: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit prompt',
    shouldReady: true,
    change: { promptId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param drawing
 * @returns
 */
export const handleSubmitDrawing = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  drawing: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
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
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { guess },
    nextPhaseFunction: getNextPhase,
  });
};
