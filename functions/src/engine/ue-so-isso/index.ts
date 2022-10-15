// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { PLAYER_COUNTS, UE_SO_ISSO_ACTIONS, UE_SO_ISSO_PHASES } from './constants';
// Types
import type { UeSoIssoInitialState, UeSoIssoSubmitAction } from './types';
// Utilities
import * as utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getWords } from './data';
import {
  prepareComparePhase,
  prepareGuessPhase,
  prepareSetupPhase,
  prepareSuggestPhase,
  prepareWordSelectionPhase,
  prepareGameOverPhase,
} from './setup';
import {
  handleConfirmGuess,
  handleSendGuess,
  handleSubmitSuggestions,
  handleSubmitValidation,
  handleSubmitWordSelectionVotes,
  handleUpdateValidSuggestions,
} from './actions';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (gameId: GameId, uid: string, language: string): UeSoIssoInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.UE_SO_ISSO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: UE_SO_ISSO_PHASES.LOBBY,
    totalRounds: 0,
    store: {
      deck: [],
      turnOrder: [],
      gameOrder: [],
      usedWords: {},
      currentWords: [],
      currentSuggestions: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Calculate remaining rounds to end game
  const roundsToEndGame = utils.helpers.getRoundsToEndGame(state.round.current, state.round.total);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, roundsToEndGame, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === UE_SO_ISSO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // SETUP/* -> WORD_SELECTION
  if (nextPhase === UE_SO_ISSO_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> SUGGEST
  if (nextPhase === UE_SO_ISSO_PHASES.SUGGEST) {
    const newPhase = await prepareSuggestPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // SUGGEST -> COMPARE
  if (nextPhase === UE_SO_ISSO_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // COMPARE -> GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === UE_SO_ISSO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles word selection votes, suggestions, validation, and guess confirmation
 * May trigger next phase
 */
export const submitAction = async (data: UeSoIssoSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case UE_SO_ISSO_ACTIONS.SUBMIT_VOTES:
      utils.firebase.validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitWordSelectionVotes(collectionName, gameId, playerId, data.votes);
    case UE_SO_ISSO_ACTIONS.SUBMIT_SUGGESTIONS:
      utils.firebase.validateSubmitActionProperties(data, ['suggestions'], 'submit suggestions');
      return handleSubmitSuggestions(collectionName, gameId, playerId, data.suggestions);
    case UE_SO_ISSO_ACTIONS.SUBMIT_VALIDATION:
      utils.firebase.validateSubmitActionProperties(data, ['validSuggestions'], 'submit valid suggestions');
      return handleSubmitValidation(collectionName, gameId, playerId, data.validSuggestions);
    case UE_SO_ISSO_ACTIONS.SUBMIT_OUTCOME:
      utils.firebase.validateSubmitActionProperties(data, ['outcome'], 'submit outcome');
      return handleConfirmGuess(collectionName, gameId, playerId, data.outcome);
    case UE_SO_ISSO_ACTIONS.VALIDATE_SUGGESTION:
      utils.firebase.validateSubmitActionProperties(data, ['suggestions'], 'validate suggestions');
      return handleUpdateValidSuggestions(collectionName, gameId, playerId, data.suggestions);
    case UE_SO_ISSO_ACTIONS.SEND_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guess'], 'send guess');
      return handleSendGuess(collectionName, gameId, playerId, data.guess);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
