import { getNextPhase } from '.';
// Services
import * as firestoreValueUtils from '../../services/firestore-core';
import { updatePlayer, updateState } from '../../services/game-session';

/**
 * Submits the gossiper and detective player roles
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the roles
 * @param gossiperPlayerId - The player ID assigned as gossiper
 * @param detectivePlayerId - The player ID assigned as detective
 */
export const handleSubmitPlayersRoles = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  gossiperPlayerId: UID,
  detectivePlayerId: UID,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the gossiper and detective players',
    change: {
      gossiperPlayerId,
      detectivePlayerId,
      [`players.${gossiperPlayerId}.role`]: 'gossiper',
      [`players.${detectivePlayerId}.role`]: 'detective',
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's associated social group
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID associating a group
 * @param associatedSocialGroupId - The social group ID to associate
 */
export const handleSubmitAssociatedSocialGroup = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  associatedSocialGroupId: string,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'associated a social group',
    shouldReady: true,
    change: {
      associatedSocialGroupId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the detective's movement to a new location
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID moving the detective
 * @param locationIndex - The index of the location to move to
 * @param [shouldReady] - Whether the player should be marked as ready
 */
export const handleSubmitDetectiveLocation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  locationIndex: number,
  shouldReady = false,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'moved the detective',
    change: {
      locationIndexes: firestoreValueUtils.pushValue(locationIndex),
    },
    shouldReady,
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the intimidation of a student
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID intimidating a student
 * @param intimidatedStudentId - The student ID being intimidated
 * @param [intimidatedStudentsIds] - Array of all intimidated student IDs
 * @param [shouldGoToTheNextPhase] - Whether to trigger phase transition
 */
export const handleSubmitIntimidation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  intimidatedStudentId: string,
  intimidatedStudentsIds?: string[],
  shouldGoToTheNextPhase = false,
) => {
  const update = intimidatedStudentsIds ? { intimidatedStudentsIds } : {};

  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'intimidated a student',
    change: {
      [`students.${intimidatedStudentId}.intimidated`]: true,
      ...update,
    },
    nextPhaseFunction: shouldGoToTheNextPhase ? getNextPhase : undefined,
  });
};

/**
 * Submits a rumor about a student or skips the rumor phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the rumor
 * @param skipRumor - Whether to skip rumoring
 * @param [rumoredStudentId] - The student ID being rumored about
 * @param [rumorIndex] - The index of the rumor
 */
export const handleSubmitRumor = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  skipRumor: boolean,
  rumoredStudentId?: string,
  rumorIndex?: number,
) => {
  const update: PlainObject = {};

  if (rumoredStudentId && rumorIndex) {
    update.rumoredStudentId = rumoredStudentId;
    update.rumorIndex = rumorIndex;
  } else {
    update.skipRumor = skipRumor;
  }

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'intimidated a student',
    shouldReady: true,
    change: {
      ...update,
    },
    nextPhaseFunction: getNextPhase,
    shouldGoToNextPhase: true,
  });
};
