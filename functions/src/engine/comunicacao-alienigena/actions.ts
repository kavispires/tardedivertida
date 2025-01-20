// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * Submits the selected alien player ID for a given game.
 * @function
 * @async
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action
 * @param alienId - The ID of the selected alien player.
 * @returns - it triggers the next state.
 */
export const handleSubmitAlien = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  alienId: PlayerId,
) => {
  return await utils.firestore.updateState({
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
 * Submits the seeding performed by a player.
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action
 * @param seeds - The seeds submitted by the player.
 * @returns - it triggers the next state when all players are ready.
 */
export const handleSubmitSeeds = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  seeds: Dictionary<number>,
) => {
  return await utils.firestore.updatePlayer({
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  objectsIds: CardId[],
  intention: CardId,
) => {
  return await utils.firestore.updatePlayer({
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
 * @param objectsIds - The IDs of the objects selected by the player.
 * @returns - it updates the current state.
 */
export const handleSubmitAlienResponse = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  alienResponse: string,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien response',
    change: {
      alienResponse,
    },
  });
};

/**
 * Submits the alien request.
 ** @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the action.
 * @param alienRequest - The alien request.
 * @param intention - The intention of the alien.
 * @returns - it triggers the next phase.
 */
export const handleSubmitAlienRequest = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  alienRequest: string,
  intention: CardId,
) => {
  return await utils.firestore.updateStore({
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  offeringsIds: CardId[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit offerings',
    shouldReady: true,
    change: { offeringsIds },
    nextPhaseFunction: getNextPhase,
  });
};
