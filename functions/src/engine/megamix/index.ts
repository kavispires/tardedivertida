// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MEGAMIX_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS, MEGAMIX_ACTIONS } from './constants';
// Types
import type {
  MegamixGameOptions,
  MegamixInitialState,
  MegamixSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareSeedingPhase,
  prepareTaskPhase,
  prepareResultPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitSeeds, handleSubmitTask } from './actions';

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
  options: MegamixGameOptions
): MegamixInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_NAMES.MEGAMIX,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: MEGAMIX_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      tasks: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

/**
 *
 * @param gameName
 * @param gameId
 * @param players
 * @returns
 */
export const getNextPhase = async (
  gameName: GameName,
  gameId: GameId,
  players: Players
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase');

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === MEGAMIX_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const data = await getData(
      store.language,
      store.options as MegamixGameOptions,
      Object.keys(players).length
    );
    const newPhase = await prepareSetupPhase(store, state, players, data);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, players);
  }

  // SETUP -> SEEDING
  if (nextPhase === MEGAMIX_PHASES.SEEDING) {
    const newPhase = await prepareSeedingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // SEEDING/RESULT -> TASK
  if (nextPhase === MEGAMIX_PHASES.TASK) {
    const newPhase = await prepareTaskPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // TASK -> RESULT
  if (nextPhase === MEGAMIX_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULT -> GAME_OVER
  if (nextPhase === MEGAMIX_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: MegamixSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MEGAMIX_ACTIONS.SUBMIT_SEEDS:
      utils.firebase.validateSubmitActionProperties(data, ['data'], 'submit seeds');
      return handleSubmitSeeds(gameName, gameId, playerId, data.data);
    case MEGAMIX_ACTIONS.SUBMIT_TASK:
      utils.firebase.validateSubmitActionProperties(data, ['data'], 'submit data');
      return handleSubmitTask(gameName, gameId, playerId, data.data);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};