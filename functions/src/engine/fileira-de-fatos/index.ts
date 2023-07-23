// Constants
import { GAME_NAMES } from '../../utils/constants';
import { FILEIRA_DE_FATOS_ACTIONS, FILEIRA_DE_FATOS_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type {
  FileiraDeFatosInitialState,
  FileiraDeFatosOptions,
  FileiraDeFatosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareResultsPhase,
  prepareScenarioOrderingPhase,
  prepareSetupPhase,
} from './setup';
import { getScenarios } from './data';
import { handleSubmitScenarioOrder } from './actions';

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
  options: FileiraDeFatosOptions
): FileiraDeFatosInitialState => {
  return utils.helpers.getDefaultInitialState<FileiraDeFatosInitialState>({
    gameId,
    gameName: GAME_NAMES.FILEIRA_DE_FATOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: FILEIRA_DE_FATOS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getScenarios(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ORDERING
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.ORDERING) {
    const newPhase = await prepareScenarioOrderingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // ORDERING -> RESULTS
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: FileiraDeFatosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case FILEIRA_DE_FATOS_ACTIONS.SUBMIT_SCENARIO_ORDER:
      utils.firebase.validateSubmitActionProperties(data, ['order'], 'submit scenario order');
      return handleSubmitScenarioOrder(gameName, gameId, playerId, data.order);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
