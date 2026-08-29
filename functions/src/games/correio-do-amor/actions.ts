// Types
import type { Play, PlaySelections } from './types';
// Services
import { updateState } from '../../services/game-session';
// Internal
import { getCardKeyFromId } from './helpers';
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
  const play: Play = {
    actorId: playerId,
    cardId: payload.playedCardId,
    cardKey: getCardKeyFromId(payload.playedCardId),
    cardKeyword: payload.playedEffect,
  };

  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your card',
    change: {
      play,
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
export const handleSelections = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  selections: PlaySelections,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your selections',
    change: { 'play.selections': selections },
    nextPhaseFunction: getNextPhase,
  });
};
