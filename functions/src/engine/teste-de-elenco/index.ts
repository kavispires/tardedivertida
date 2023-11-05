// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, TESTE_DE_ELENCO_ACTIONS, TESTE_DE_ELENCO_PHASES } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  TesteDeElencoInitialState,
  TesteDeElencoOptions,
  TesteDeElencoSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareSetupPhase,
  prepareMovieGenreSelectionPhase,
  prepareActorSelectionPhase,
  prepareResultPhase,
} from './setup';
import { handleSubmitActor, handleSubmitGenre } from './actions';
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
  language: string,
  options: TesteDeElencoOptions
): TesteDeElencoInitialState => {
  return utils.helpers.getDefaultInitialState<TesteDeElencoInitialState>({
    gameId,
    gameName: GAME_NAMES.TESTE_DE_ELENCO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: TESTE_DE_ELENCO_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state);

  // RULES -> SETUP
  if (nextPhase === TESTE_DE_ELENCO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> MOVIE_GENRE_SELECTION
  if (nextPhase === TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION) {
    const newPhase = await prepareMovieGenreSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> ACTOR_SELECTION
  if (nextPhase === TESTE_DE_ELENCO_PHASES.ACTOR_SELECTION) {
    const newPhase = await prepareActorSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // ACTOR_SELECTION -> RESULT
  if (nextPhase === TESTE_DE_ELENCO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULT -> GAME_OVER
  if (nextPhase === TESTE_DE_ELENCO_PHASES.GAME_OVER) {
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
export const submitAction = async (data: TesteDeElencoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  let actionText = 'submit action';

  switch (action) {
    case TESTE_DE_ELENCO_ACTIONS.SELECT_MOVIE_GENRE:
      actionText = 'select genre';
      utils.firebase.validateSubmitActionProperties(data, ['genre'], actionText);
      return handleSubmitGenre(gameName, gameId, playerId, data.genre);

    case TESTE_DE_ELENCO_ACTIONS.SELECT_ACTOR:
      actionText = 'select actor';
      utils.firebase.validateSubmitActionProperties(data, ['actorId'], actionText);
      return handleSubmitActor(gameName, gameId, playerId, data.actorId);

    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
