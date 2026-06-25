// Services
import { updatePlayer, updateState } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the current orientation for the sketch
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the orientation
 * @param orientation - The orientation string
 */
export const handleSubmitOrientation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  orientation: string,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit orientation',
    change: { currentOrientation: orientation },
  });
};

/**
 * Submits the player's sketch drawing
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the sketch
 * @param sketch - The sketch data string
 */
export const handleSubmitSketch = async (gameName: string, gameId: UID, playerId: UID, sketch: string) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit sketch',
    shouldReady: true,
    change: { sketch },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's vote for a sketch
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the vote
 * @param vote - The player ID being voted for
 */
export const handleSubmitVote = async (gameName: string, gameId: UID, playerId: UID, vote: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
