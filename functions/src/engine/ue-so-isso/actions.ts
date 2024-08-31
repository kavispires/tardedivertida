// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * Submit the chosen words for the round
 * @param gameName
 * @param gameId
 * @param playerId
 * @param votes
 * @returns
 */
export const handleSubmitWordSelectionVotes = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: PlainObject
) => {
  return await utils.firestore.updatePlayer({
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
 * Submit a player's suggestions (1 or 2 depending on player count)
 * @param gameName
 * @param gameId
 * @param playerId
 * @param suggestions
 * @returns
 */
export const handleSubmitSuggestions = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  suggestions: PlainObject
) => {
  return await utils.firestore.updatePlayer({
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
 * Live updates the valid clues
 * @param gameName
 * @param gameId
 * @param playerId
 * @param suggestions
 * @returns
 */
export const handleUpdateValidSuggestions = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  suggestions: PlainObject
) => {
  return await utils.firestore.updateState({
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
 * Confirms the valid clues
 * @param gameName
 * @param gameId
 * @param playerId
 * @param validSuggestions
 * @returns
 */
export const handleSubmitValidation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  validSuggestions: PlainObject
) => {
  return await utils.firestore.updateStore({
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
 * Submits the active player's guess
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSendGuess = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: string
) => {
  return await utils.firestore.updateState({
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
 * Confirms if the active player's guess is correct or not
 * @param gameName
 * @param gameId
 * @param playerId
 * @param outcome
 * @returns
 */
export const handleConfirmGuess = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  outcome: string
) => {
  return await utils.firestore.updateStore({
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
