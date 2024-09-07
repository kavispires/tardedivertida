// Constants
import { GAME_NAMES } from '../../utils/constants';
import { LINHAS_CRUZADAS_ACTIONS, LINHAS_CRUZADAS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  LinhasCruzadasInitialState,
  LinhasCruzadasOptions,
  LinhasCruzadasSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareDrawingPhase,
  prepareGameOverPhase,
  prepareNamingPhase,
  preparePresentationPhase,
  preparePromptSelectionPhase,
  prepareSetupPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitDrawing, handleSubmitGuess, handleSubmitPrompt } from './actions';

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
  language: Language,
  version: string,
  options: LinhasCruzadasOptions
): LinhasCruzadasInitialState => {
  return utils.helpers.getDefaultInitialState<LinhasCruzadasInitialState>({
    gameId,
    gameName: GAME_NAMES.LINHAS_CRUZADAS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: LINHAS_CRUZADAS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state.round);

  // RULES -> SETUP
  if (nextPhase === LINHAS_CRUZADAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CLUE_WRITING
  if (nextPhase === LINHAS_CRUZADAS_PHASES.PROMPT_SELECTION) {
    const newPhase = await preparePromptSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CLUE_WRITING -> GUESSING
  if (nextPhase === LINHAS_CRUZADAS_PHASES.DRAWING) {
    const newPhase = await prepareDrawingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === LINHAS_CRUZADAS_PHASES.NAMING) {
    const newPhase = await prepareNamingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === LINHAS_CRUZADAS_PHASES.PRESENTATION) {
    const newPhase = await preparePresentationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === LINHAS_CRUZADAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: LinhasCruzadasSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case LINHAS_CRUZADAS_ACTIONS.SUBMIT_PROMPT:
      utils.firebase.validateSubmitActionProperties(data, ['promptId'], 'submit prompt');
      return handleSubmitPrompt(gameName, gameId, playerId, data.promptId, data.randomSelection);
    case LINHAS_CRUZADAS_ACTIONS.SUBMIT_DRAWING:
      utils.firebase.validateSubmitActionProperties(data, ['drawing'], 'submit drawing');
      return handleSubmitDrawing(gameName, gameId, playerId, data.drawing);
    case LINHAS_CRUZADAS_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitGuess(gameName, gameId, playerId, data.guess);
    default:
      utils.firestore.throwException(`Given action ${action} is not allowed`);
  }
};
