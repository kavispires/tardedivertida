// Constants
import { GAME_NAMES } from '../../utils/constants';
import { PLAYER_COUNTS, DUETOS_PHASES, DUETOS_ACTIONS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  DuetosInitialState,
  DuetosOptions,
  DuetosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { handleSubmitPairs } from './actions';
import { prepareSetupPhase, prepareGameOverPhase, preparePairPhase, prepareResultsPhase } from './setup';
import { getResourceData } from './data';

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
  options: DuetosOptions,
): DuetosInitialState => {
  return utils.helpers.getDefaultInitialState<DuetosInitialState>({
    gameId,
    gameName: GAME_NAMES.DUETOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: DUETOS_PHASES.LOBBY,
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
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === DUETOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, store.options);

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> PAIRING
  if (nextPhase === DUETOS_PHASES.PAIRING) {
    const newPhase = await preparePairPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PAIRING -> RESULTS
  if (nextPhase === DUETOS_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === DUETOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: DuetosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case DUETOS_ACTIONS.SUBMIT_PAIRS:
      utils.firebase.validateSubmitActionProperties(data, ['pairs'], 'submit pairs');
      return handleSubmitPairs(gameName, gameId, playerId, data.pairs);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
