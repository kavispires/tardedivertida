// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { LINHAS_CRUZADAS_PHASES, PLAYER_COUNT, TOTAL_ROUNDS } from './constants';
// Types
import { GameId, Language, Players } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
// Internal Functions
import { determineNextPhase } from './helpers';
import { LinhasCruzadasInitialState, LinhasCruzadasSubmitAction } from './types';
import {
  prepareDrawingPhase,
  prepareGameOverPhase,
  prepareNamingPhase,
  preparePresentationPhase,
  preparePromptSelectionPhase,
  prepareSetupPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitDrawing, handleSubmitGuess } from './actions';

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
): LinhasCruzadasInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.LINHAS_CRUZADAS,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: LINHAS_CRUZADAS_PHASES.LOBBY,
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
  const nextPhase = determineNextPhase(
    state?.phase,
    Object.keys(players).length,
    store.album,
    state?.lastRound
  );

  // RULES -> SETUP
  if (nextPhase === LINHAS_CRUZADAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // * -> CLUE_WRITING
  if (nextPhase === LINHAS_CRUZADAS_PHASES.PROMPT_SELECTION) {
    const newPhase = await preparePromptSelectionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // CLUE_WRITING -> GUESSING
  if (nextPhase === LINHAS_CRUZADAS_PHASES.DRAWING) {
    const newPhase = await prepareDrawingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === LINHAS_CRUZADAS_PHASES.NAMING) {
    const newPhase = await prepareNamingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === LINHAS_CRUZADAS_PHASES.PRESENTATION) {
    const newPhase = await preparePresentationPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === LINHAS_CRUZADAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: LinhasCruzadasSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_DRAWING':
      firebaseUtils.validateSubmitActionProperties(data, ['drawing'], 'submit drawing');
      return handleSubmitDrawing(collectionName, gameId, playerId, data.drawing);
    case 'SUBMIT_GUESS':
      firebaseUtils.validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitGuess(collectionName, gameId, playerId, data.guess);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
