// Types
import type { Guesses } from './types';
// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Handles crime scene submission with all crime details
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the crime
 * @param data - Object containing all crime scene details
 */
export const handleSubmitCrime = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  data: {
    /**
     * Identifier of the selected crime weapon.
     */
    weaponId: string;
    /**
     * Identifier of the selected crime evidence.
     */
    evidenceId: string;
    /**
     * Identifier of the selected crime victim.
     */
    victimId?: string;
    /**
     * Identifier of the location associated with this entry.
     */
    locationId?: string;
    /**
     * The selected cause-of-death option index.
     */
    causeOfDeathIndex: number;
    /**
     * The selected evidence-reason option index.
     */
    reasonForEvidenceIndex: number;
    /**
     * The selected victim-tile option index.
     */
    victimIndex: number;
    /**
     * The selected location-tile option index.
     */
    locationIndex: number;
  },
) => {
  const change: PlainObject = {
    weaponId: data.weaponId,
    evidenceId: data.evidenceId,
    causeOfDeathIndex: data.causeOfDeathIndex,
    reasonForEvidenceIndex: data.reasonForEvidenceIndex,
    locationIndex: data.locationIndex,
    victimIndex: data.victimIndex,
  };

  if (data.victimId) {
    change.victimId = data.victimId;
  }
  if (data.locationId) {
    change.locationId = data.locationId;
  }

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your crime',
    shouldReady: true,
    change,
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles marking a scene index
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the mark
 * @param sceneIndex - The scene index being marked
 */
export const handleSubmitMark = async (gameName: string, gameId: UID, playerId: UID, sceneIndex: number) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your mark',
    shouldReady: true,
    change: { sceneIndex },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Saves the player's crime guesses, marks them ready, and checks phase progression.
 * @param gameName - The game identifier used to locate the session
 * @param gameId - The identifier of the game session
 * @param playerId - The identifier of the player submitting or receiving the update
 * @param guesses - The guesses submitted for the hidden answers
 * @returns The player update or phase-transition result
 */
export const handleSubmitGuesses = async (gameName: string, gameId: UID, playerId: UID, guesses: Guesses) => {
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
