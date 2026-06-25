// Services
import * as firestoreValueUtils from '../../services/firestore-core';
import { updatePlayer, updateState } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Handles player card submission
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting card
 * @param card - The card data
 */
export const handleCard = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  payload: {
    playedCardId: UID;
    keptCardId: UID;
    playedEffect: string;
  },
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your card',
    change: {
      activeCardId: payload.playedCardId,
      activeEffectKeyword: payload.playedEffect,
      discardPile: firestoreValueUtils.pushValue(payload.playedCardId),
      [`players.${playerId}.hand`]: [payload.keptCardId],
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles player selections submission
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting selections
 * @param selections - The selections data
 */
export const handleSelections = async (gameName: string, gameId: UID, playerId: UID, selections: unknown) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your selections',
    shouldReady: true,
    change: { selections },
    nextPhaseFunction: getNextPhase,
  });
};
