// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Handles player word selection submission
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
    actionText: 'submit the words',
    shouldReady: true,
    change: { selectedWordsIds: words },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles player clue submissions for their selected words
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting clues
 * @param clues - Array of clue strings
 */
export const handleSubmitClues = async (gameName: string, gameId: UID, playerId: UID, clues: string[]) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clues',
    shouldReady: true,
    change: { clues },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles player guess submissions matching clues to words
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting guesses
 * @param guesses - Dictionary mapping clue entry IDs to arrays of thing IDs
 */
export const handleSubmitGuesses = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Record<string, string[]>, // clueEntryId -> things ids[]
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};
