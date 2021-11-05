// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { PLAYER_COUNT, UE_SO_ISSO_PHASES } from './constants';
// Interfaces
import { Players, GameId } from '../../utils/interfaces';
import { UeSoIssoInitialState, UeSoIssoSubmitAction } from './interfaces';
// Utilities
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
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
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.UE_SO_ISSO,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: UE_SO_ISSO_PHASES.LOBBY,
    totalRounds: 0,
    store: {
      language,
      deck: [],
      turnOrder: [],
      gameOrder: [],
      usedWords: {},
      currentWords: [],
      currentSuggestions: [],
    },
  });
};

export const nextUeSoIssoPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Calculate remaining rounds to end game
  const roundsToEndGame = utils.getRoundsToEndGame(state.round.current, state.round.total);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, roundsToEndGame);

  // RULES -> SETUP
  if (nextPhase === UE_SO_ISSO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return nextUeSoIssoPhase(collectionName, gameId, players);
  }

  // SETUP/* -> WORD_SELECTION
  if (nextPhase === UE_SO_ISSO_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> SUGGEST
  if (nextPhase === UE_SO_ISSO_PHASES.SUGGEST) {
    const newPhase = await prepareSuggestPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // SUGGEST -> COMPARE
  if (nextPhase === UE_SO_ISSO_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // COMPARE -> GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === UE_SO_ISSO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles word selection votes, suggestions, validation, and guess confirmation
 * May trigger next phase
 */
export const submitAction = async (data: UeSoIssoSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_VOTES':
      if (!data.votes) {
        firebaseUtils.throwException('Missing `votes` value', 'submit votes');
      }
      return handleSubmitWordSelectionVotes(collectionName, gameId, playerId, data.votes);
    case 'SUBMIT_SUGGESTIONS':
      if (!data.suggestions) {
        firebaseUtils.throwException('Missing `suggestions` value', 'submit suggestions');
      }
      return handleSubmitSuggestions(collectionName, gameId, playerId, data.suggestions);
    case 'SUBMIT_VALIDATION':
      if (!data.validSuggestions) {
        firebaseUtils.throwException('Missing `validSuggestions` value', 'submit valid suggestions');
      }
      return handleSubmitValidation(collectionName, gameId, playerId, data.validSuggestions);
    case 'SUBMIT_OUTCOME':
      if (!data.outcome) {
        firebaseUtils.throwException('Missing `outcome` value', 'submit outcome');
      }
      return handleConfirmGuess(collectionName, gameId, playerId, data.outcome);
    case 'VALIDATE_SUGGESTION':
      if (!data.suggestions) {
        firebaseUtils.throwException('Missing `suggestions` value', 'submit suggestions');
      }
      return handleUpdateValidSuggestions(collectionName, gameId, playerId, data.suggestions);
    case 'SEND_GUESS':
      if (!data.guess) {
        firebaseUtils.throwException('Missing `guess` value', 'send guess');
      }
      return handleSendGuess(collectionName, gameId, playerId, data.guess);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
