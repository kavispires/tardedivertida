// Constants
import { GAME_NAMES } from '../../utils/constants';
import { LABIRINTO_SECRETO_PHASES, PLAYER_COUNTS, MAX_ROUNDS, LABIRINTO_SECRETO_ACTIONS } from './constants';
// Types
import type {
  LabirintoSecretoGameOptions,
  LabirintoSecretoInitialState,
  LabirintoSecretoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareMapBuildingPhase,
  preparePathFollowingPhase,
  prepareResultsPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitMap, handleSubmitGuess } from './actions';

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
  options: LabirintoSecretoGameOptions
): LabirintoSecretoInitialState => {
  return utils.helpers.getDefaultInitialState<LabirintoSecretoInitialState>({
    gameId,
    gameName: GAME_NAMES.LABIRINTO_SECRETO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: LABIRINTO_SECRETO_PHASES.LOBBY,
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
  const isGameOver = determineGameOver(players, state?.round);
  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    isGameOver,
    state?.turnOrder,
    state?.activePlayerId
  );

  // RULES -> SETUP
  if (nextPhase === LABIRINTO_SECRETO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const data = await getData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, data);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> DRAW
  if (nextPhase === LABIRINTO_SECRETO_PHASES.MAP_BUILDING) {
    const newPhase = await prepareMapBuildingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DRAW -> EVALUATION
  if (nextPhase === LABIRINTO_SECRETO_PHASES.PATH_FOLLOWING) {
    const newPhase = await preparePathFollowingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === LABIRINTO_SECRETO_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GALLERY -> GAME_OVER
  if (nextPhase === LABIRINTO_SECRETO_PHASES.GAME_OVER) {
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
export const submitAction = async (data: LabirintoSecretoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case LABIRINTO_SECRETO_ACTIONS.SUBMIT_MAP:
      utils.firebase.validateSubmitActionProperties(data, ['newMap'], 'submit map');
      return handleSubmitMap(gameName, gameId, playerId, data.newMap);
    case LABIRINTO_SECRETO_ACTIONS.SUBMIT_PATH:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['pathId', 'guess', 'choseRandomly'],
        'submit guess'
      );
      return handleSubmitGuess(gameName, gameId, playerId, data.pathId, data.guess, data.choseRandomly);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
