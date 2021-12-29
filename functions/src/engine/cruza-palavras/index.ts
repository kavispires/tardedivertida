// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { CRUZA_PALAVRAS_PHASES, PLAYER_COUNT, TOTAL_ROUNDS } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
// Internal Functions
import { determineNextPhase } from './helpers';
import { XTudoPalavrasInitialState, XTudoPalavrasSubmitAction } from './types';
import {
  prepareClueWritingPhase,
  prepareGuessingPhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSetupPhase,
} from './setup';
import { getWords } from './data';
import { handleSubmitClue, handleSubmitGuesses } from './actions';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: Language
): XTudoPalavrasInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.CRUZA_PALAVRAS,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: CRUZA_PALAVRAS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      language,
      deck: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCount = PLAYER_COUNT;

export const getNextPhase = async (
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === CRUZA_PALAVRAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // * -> CLUE_WRITING
  if (nextPhase === CRUZA_PALAVRAS_PHASES.CLUE_WRITING) {
    const newPhase = await prepareClueWritingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // CLUE_WRITING -> GUESSING
  if (nextPhase === CRUZA_PALAVRAS_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === CRUZA_PALAVRAS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === CRUZA_PALAVRAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: XTudoPalavrasSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_CLUE':
      firebaseUtils.validateSubmitActionProperties(data, ['clue'], 'submit category');
      return handleSubmitClue(collectionName, gameId, playerId, data.clue);
    case 'SUBMIT_GUESSES':
      firebaseUtils.validateSubmitActionProperties(data, ['guesses'], 'submit guess');
      return handleSubmitGuesses(collectionName, gameId, playerId, data.guesses);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
