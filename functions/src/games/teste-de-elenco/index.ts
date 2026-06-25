// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  TesteDeElencoInitialState,
  TesteDeElencoOptions,
  TesteDeElencoSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { MAX_ROUNDS, PLAYER_COUNTS, TESTE_DE_ELENCO_ACTIONS, TESTE_DE_ELENCO_PHASES } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { handleSubmitActor, handleSubmitGenre } from './actions';
import { getData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareSetupPhase,
  prepareMovieGenreSelectionPhase,
  prepareActorSelectionPhase,
  prepareResultPhase,
} from './setup';

/**
 * Gets the initial state for a new game session
 * @param gameId - The game session ID
 * @param uid - The user ID of the game creator
 * @param language - The language code
 * @param version - The game version
 * @param options - Optional game configuration options
 */
export const getInitialState = (
  gameId: UID,
  uid: string,
  language: string,
  version: string,
  options: TesteDeElencoOptions,
): TesteDeElencoInitialState => {
  return utils.game.getDefaultInitialState<TesteDeElencoInitialState>({
    gameId,
    gameName: GAME_NAMES.TESTE_DE_ELENCO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Gets the player count requirements for the game
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

/**
 * Handles phase progression and prepares the next game phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 */
export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state);

  // LOBBY -> SETUP
  if (nextPhase === TESTE_DE_ELENCO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> MOVIE_GENRE_SELECTION
  if (nextPhase === TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION) {
    const newPhase = await prepareMovieGenreSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> ACTOR_SELECTION
  if (nextPhase === TESTE_DE_ELENCO_PHASES.ACTOR_SELECTION) {
    const newPhase = await prepareActorSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // ACTOR_SELECTION -> RESULT
  if (nextPhase === TESTE_DE_ELENCO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULT -> GAME_OVER
  if (nextPhase === TESTE_DE_ELENCO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: TesteDeElencoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  let actionText = 'submit action';

  switch (action) {
    case TESTE_DE_ELENCO_ACTIONS.SELECT_MOVIE_GENRE:
      actionText = 'select genre';
      validateSubmitActionProperties(data, ['genre', 'movieTitle', 'propsIds'], actionText);
      return handleSubmitGenre(gameName, gameId, playerId, data.genre, data.movieTitle, data.propsIds);

    case TESTE_DE_ELENCO_ACTIONS.SELECT_ACTOR:
      actionText = 'select actor';
      validateSubmitActionProperties(data, ['actorId'], actionText);
      return handleSubmitActor(gameName, gameId, playerId, data.actorId);

    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
