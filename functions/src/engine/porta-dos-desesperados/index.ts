// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  PORTA_DOS_DESESPERADOS_PHASES,
  PLAYER_COUNTS,
  MAX_ROUNDS,
  PORTA_DOS_DESESPERADOS_ACTIONS,
} from './constants';
// Types
import type {
  PortaDosDesesperadosInitialState,
  PortaDosDesesperadosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
  PortaDosDesesperadosOptions,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareBookPossessionPhase,
  prepareDoorChoicePhase,
  prepareResolutionPhase,
} from './setup';
import { handleSubmitDoor, handleSubmitPages } from './actions';
import { getData } from './data';

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
  options: PortaDosDesesperadosOptions
): PortaDosDesesperadosInitialState => {
  return utils.helpers.getDefaultInitialState<PortaDosDesesperadosInitialState>({
    gameId,
    gameName: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: PORTA_DOS_DESESPERADOS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
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
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const isGameOver = determineGameOver(
    state?.phase,
    state?.round,
    state?.outcome,
    state?.winCondition,
    state?.currentCorridor,
    state?.magic
  );
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // RULES -> SETUP
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData((store.options ?? {}).originalDecks);

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, newPhase?.update?.state as FirebaseStateData);
  }

  // * -> BOOK_POSSESSION
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION) {
    const newPhase = await prepareBookPossessionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // BOOK_POSSESSION -> DOOR_CHOICE
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE) {
    const newPhase = await prepareDoorChoicePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DOOR_CHOICE -> RESOLUTION
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.GAME_OVER) {
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
export const submitAction = async (data: PortaDosDesesperadosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_PAGES:
      utils.firebase.validateSubmitActionProperties(data, ['pageIds'], 'submit pages');
      return handleSubmitPages(gameName, gameId, playerId, data.pageIds);
    case PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_DOOR:
      utils.firebase.validateSubmitActionProperties(data, ['doorId'], 'submit door');
      return handleSubmitDoor(gameName, gameId, playerId, data.doorId, data.ready);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
