// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * Submits the selected alien player ID for a given game.
 *
 * @function
 * @async
 * @param {GameName} gameName - The name of the game.
 * @param {GameId} gameId - The ID of the game.
 * @param {PlayerId} playerId - The ID of the player who is submitting the alien ID.
 * @param {PlayerId} alienId - The ID of the selected alien player.
 * @returns {Promise} - A promise that resolves after the update is complete.
 */

export const handleSubmitAlien = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  alienId: PlayerId
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien player id',
    change: {
      alienId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitHumanInquiry = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  objectsIds: CardId[]
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: `submit ${playerId} objects`,
    shouldReady: true,
    change: { objectsIds },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitAlienResponse = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  alienResponse: string
) => {
  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien response',
    change: {
      alienResponse,
    },
  });
};

export const handleSubmitAlienRequest = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  alienRequest: string
) => {
  return await utils.firebase.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit alien request',
    change: {
      alienRequest,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitOffering = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  offeringId: CardId
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit offering',
    shouldReady: true,
    change: { offeringId },
    nextPhaseFunction: getNextPhase,
  });
};
