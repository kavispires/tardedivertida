import { shuffle } from 'lodash';
// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the player's selected characters
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting characters
 * @param characters - Array of character IDs
 */
export const handleSubmitCharacters = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  characters: UID[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your characters',
    shouldReady: true,
    change: { selectedCharacters: shuffle(characters) },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's selected glyphs for communication
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting glyphs
 * @param glyphs - Dictionary of glyph selections
 */
export const handleSubmitGlyphs = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  glyphs: Dictionary<boolean>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your glyphs',
    shouldReady: true,
    change: { selectedGlyphs: glyphs },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's guesses matching players to characters
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting guesses
 * @param guesses - Dictionary mapping player IDs to character IDs
 * @param choseRandomly - Whether guesses were chosen randomly
 */
export const handleSubmitGuesses = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Record<UID, UID>,
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
