// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';
import type { Guesses } from './types';

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
    weaponId: string;
    evidenceId: string;
    victimId?: string;
    locationId?: string;
    causeOfDeathIndex: number;
    reasonForEvidenceIndex: number;
    victimIndex: number;
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
