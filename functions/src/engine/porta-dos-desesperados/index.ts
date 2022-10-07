// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
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
} from './types';
// Utilities
import * as utils from '../../utils';
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
): PortaDosDesesperadosInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.PORTA_DOS_DESESPERADOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: PORTA_DOS_DESESPERADOS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

/**
 *
 * @param collectionName
 * @param gameId
 * @param players
 * @returns
 */
export const getNextPhase = async (
  collectionName: GameName,
  gameId: GameId,
  players: Players
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(collectionName, gameId, 'prepare next phase');

  // Determine if it's game over
  const isGameOver = determineGameOver(
    state?.phase,
    state?.round,
    state?.outcome,
    state?.winCondition,
    state?.currentDoor
  );
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
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
    const newPhase = await prepareGameOverPhase(store, state, players);
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
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_PAGES:
      utils.firebase.validateSubmitActionProperties(data, ['pageIds'], 'submit pages');
      return handleSubmitPages(collectionName, gameId, playerId, data.pageIds);
    case PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_DOOR:
      utils.firebase.validateSubmitActionProperties(data, ['doorId'], 'submit door');
      return handleSubmitDoor(collectionName, gameId, playerId, data.doorId, data.ready);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
