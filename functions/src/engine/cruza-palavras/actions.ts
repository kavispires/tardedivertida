// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles word selection submission
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting words
 * @param words - Array of selected word IDs
 */
export const handleSubmitWords = async (gameName: string, gameId: UID, playerId: UID, words: UID[]) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your words',
    shouldReady: true,
    change: { selectedWordsIds: words },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles clue submission for a specific coordinate
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the clue
 * @param clue - The clue text
 * @param currentClueCoordinate - The coordinate number for this clue
 */
export const handleSubmitClue = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  clue: string,
  currentClueCoordinate: number,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    change: { clue, currentClueCoordinate },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles guess submissions matching clues to words
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting guesses
 * @param guesses - Dictionary of guesses
 * @param choseRandomly - Whether guesses were chosen randomly
 */
export const handleSubmitGuesses = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Dictionary<string>,
  choseRandomly: boolean,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
