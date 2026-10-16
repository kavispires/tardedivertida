// Services
import { updatePlayer } from '../../services/game-session';
// Internal
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
    /**
     * The meaning assigned to the concept.
     */
    meaning: string;
    /**
     * Identifiers of items associated with this concept or name.
     */
    itemsIds: UID[];
    /**
     * Identifier of the player associated with this entry.
     */
    playerId: UID;
    /**
     * The age in which the concept was introduced.
     */
    age: number;
    /**
     * Identifier of the sound used to pronounce the concept.
     */
    soundId?: string;
    /**
     * The localized syllable associated with the concept sound.
     */
    syllable?: DualLanguageValue;
    /**
     * The key used to identify or group this entry.
     */
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
