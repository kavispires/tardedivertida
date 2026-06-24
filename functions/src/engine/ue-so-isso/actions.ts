// Utils
import { updatePlayer, updateState, updateStore } from '../../services/game-session';
// Internal
import { getNextPhase } from '.';
import type { PlayerSuggestion } from './types';

/**
 * Submits the chosen words for the round voting
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting votes
 * @param votes - Array of word IDs voted for
 */
export const handleSubmitWordSelectionVotes = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  votes: string[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your word selection votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits a player's suggestions for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting suggestions
 * @param suggestions - Array of suggestion strings
 */
export const handleSubmitSuggestions = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  suggestions: string[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your suggestions',
    shouldReady: true,
    change: { suggestions },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Updates the valid suggestions in real-time
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID updating suggestions
 * @param suggestions - Dictionary of suggestion validations
 */
export const handleUpdateValidSuggestions = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  suggestions: PlainObject,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'update valid suggestions',
    change: {
      suggestions,
    },
  });
};

/**
 * Confirms the valid suggestions after evaluation
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID confirming validation
 * @param validSuggestions - Array of validated player suggestion objects
 */
export const handleSubmitValidation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  validSuggestions: PlayerSuggestion[],
) => {
  return await updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the suggestions validation',
    change: {
      validSuggestions,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the active player's guess for the secret word
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID sending the guess
 * @param guess - The guess string
 */
export const handleSendGuess = async (gameName: string, gameId: UID, playerId: UID, guess: string) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'send guess',
    change: {
      guess,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Confirms whether the active player's guess is correct or not
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID confirming the guess
 * @param outcome - The outcome string (correct/incorrect)
 */
export const handleConfirmGuess = async (gameName: string, gameId: UID, playerId: UID, outcome: string) => {
  return await updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'confirm guess',
    change: {
      outcome,
    },
    nextPhaseFunction: getNextPhase,
  });
};
