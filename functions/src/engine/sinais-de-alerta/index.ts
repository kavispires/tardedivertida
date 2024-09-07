// Constants
import { GAME_NAMES } from '../../utils/constants';
import { SINAIS_DE_ALERTA_ACTIONS, SINAIS_DE_ALERTA_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  SinaisDeAlertaInitialState,
  SinaisDeAlertaOptions,
  SinaisDeAlertaSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareSetupPhase,
  prepareEvaluationPhase,
  prepareDrawingPhase,
  prepareGalleryPhase,
} from './setup';
import { getCards } from './data';
import { handleSubmitDrawing, handleSubmitEvaluation } from './actions';

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
  options: SinaisDeAlertaOptions
): SinaisDeAlertaInitialState => {
  return utils.helpers.getDefaultInitialState<SinaisDeAlertaInitialState>({
    gameId,
    gameName: GAME_NAMES.SINAIS_DE_ALERTA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: SINAIS_DE_ALERTA_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      subjectsDeck: [],
      descriptorsDeck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === SINAIS_DE_ALERTA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getCards(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> DRAWING
  if (nextPhase === SINAIS_DE_ALERTA_PHASES.DRAWING) {
    const newPhase = await prepareDrawingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // DRAWING -> EVALUATION
  if (nextPhase === SINAIS_DE_ALERTA_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === SINAIS_DE_ALERTA_PHASES.GALLERY) {
    const newPhase = await prepareGalleryPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GALLERY -> GAME_OVER
  if (nextPhase === SINAIS_DE_ALERTA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Submits an action for the SinaisDeAlerta game.
 *
 * @param data - The data object containing the necessary information for the action.
 * @returns A promise that resolves to the result of the action.
 * @throws An exception if the given action is not allowed.
 */
export const submitAction = async (data: SinaisDeAlertaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case SINAIS_DE_ALERTA_ACTIONS.SUBMIT_SDA_DRAWING:
      utils.firebase.validateSubmitActionProperties(data, ['drawing'], 'submit drawing');
      return handleSubmitDrawing(gameName, gameId, playerId, data.drawing);
    case SINAIS_DE_ALERTA_ACTIONS.SUBMIT_SDA_EVALUATION:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit evaluation');
      return handleSubmitEvaluation(gameName, gameId, playerId, data.guesses, data.choseRandomly);
    default:
      utils.firebase.throwExceptionV2(`Given action ${action} is not allowed`, action);
  }
};
