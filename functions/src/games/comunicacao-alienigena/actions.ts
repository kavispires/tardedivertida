import { getNextPhase } from '.';
// Services
import * as firestoreValueUtils from '../../services/firestore-core';
import { updatePlayer, updateState, updateStore } from '../../services/game-session';

/**
 * Submits the selected alien player ID for a given game
 * @param gameName - The name of the game
 * @param gameId - The ID of the game
 * @param playerId - The ID of the player who is submitting the action
 * @param alienId - The ID of the selected alien player
 */
export const handleSubmitAlien = async (gameName: string, gameId: UID, playerId: UID, alienId: UID) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien player id',
    change: {
      alienId,
      [`players.${alienId}.role`]: 'alien',
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the seeding performed by a player
 * @param gameName - The name of the game
 * @param gameId - The ID of the game
 * @param playerId - The ID of the player who is submitting the action
 * @param seeds - The seeds submitted by the player
 */
export const handleSubmitSeeds = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  seeds: Dictionary<number>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit seeds',
    shouldReady: true,
    change: {
      alienSeeds: seeds,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the selected objects by a given player.
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action.
 * @param objectsIds - The IDs of the objects selected by the player.
 * @returns - it triggers the next state when all players are ready.
 */
export const handleSubmitHumanInquiry = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  objectsIds: UID[],
  intention: UID,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: `submit ${playerId} objects`,
    shouldReady: true,
    change: { objectsIds, intention },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits item response from the alien.
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action.
 * @param alienResponses - The responses from the alien.
 * @returns - it updates the current state.
 */
export const handleSubmitAlienResponses = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  alienResponses: Record<string, string>,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien responses',
    change: {
      alienResponses,
      knownSpriteIds: firestoreValueUtils.pushValue(...Object.values(alienResponses)),
    },
  });
};

export const handleConfirmNotes = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  notes: Dictionary<string>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'confirm notes',
    change: {
      notes,
    },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the alien request.
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action.
 * @param alienRequest - The alien request.
 * @param intention - The intention of the alien.
 * @returns - it triggers the next phase.
 */
export const handleSubmitAlienRequest = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  alienRequest: string,
  intention: UID,
) => {
  return await updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien request',
    change: {
      alienRequest,
      intention,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the offerings of the players.
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action.
 * @param offeringsIds - The IDs of the offerings submitted by the player.
 * @returns - it triggers the next state when all players are ready.
 */
export const handleSubmitOfferings = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  offeringsIds: UID[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit offerings',
    shouldReady: true,
    change: { offeringsIds },
    nextPhaseFunction: getNextPhase,
  });
};
