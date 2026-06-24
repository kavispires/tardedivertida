// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's proposed concepts for items
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting concepts
 * @param proposedConcepts - Array of concept objects with meanings and associated items
 */
export const handleSubmitConcepts = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  proposedConcepts: {
    meaning: string;
    itemsIds: UID[];
    playerId: UID;
    age: number;
    soundId?: string;
    syllable?: DualLanguageValue;
    key?: string;
  }[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your concept',
    shouldReady: true,
    change: { proposedConcepts },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's downvoted concept IDs
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID downvoting concepts
 * @param conceptIds - Array of concept IDs to downvote
 */
export const handleDownvoteConcepts = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  conceptIds: UID[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'downvote concepts',
    shouldReady: true,
    change: { downvotedConceptIds: conceptIds },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits a proposed name for an item using concepts
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID proposing a name
 * @param itemId - The item ID being named
 * @param name - The proposed name
 * @param conceptsIds - Array of concept IDs used in the name
 */
export const handleSubmitName = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  itemId: UID,
  name: string,
  conceptsIds: UID[],
) => {
  const proposedName = {
    name,
    itemId,
    conceptsIds,
  };

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit new name',
    shouldReady: true,
    change: { proposedName },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's guesses matching items to names
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting guesses
 * @param guesses - Dictionary mapping item IDs to name IDs
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
