// Types
import type {
  EsquiadoresInitialState,
  EsquiadoresOptions,
  EsquiadoresSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { ESQUIADORES_ACTIONS, ESQUIADORES_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
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
import { handleSubmitChoices, handleSubmitBets } from './actions';
import { getDilemmas } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareResultsPhase,
  prepareBetsPhase,
  prepareStartingResultsPhase,
  prepareBoostsPhase,
  preparePreliminaryResultsPhase,
  prepareLastChangePhase,
  prepareSetupPhase,
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
  language: Language,
  version: string,
  options: EsquiadoresOptions,
): EsquiadoresInitialState => {
  return utils.game.getDefaultInitialState<EsquiadoresInitialState>({
    gameId,
    gameName: GAME_NAMES.ESQUIADORES,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === ESQUIADORES_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getDilemmas(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> BETS
  if (nextPhase === ESQUIADORES_PHASES.BETS) {
    const newPhase = await prepareBetsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // BETS -> STARTING_RESULTS
  if (nextPhase === ESQUIADORES_PHASES.STARTING_RESULTS) {
    const newPhase = await prepareStartingResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // STARTING_RESULTS -> BOOSTS
  if (nextPhase === ESQUIADORES_PHASES.BOOSTS) {
    const newPhase = await prepareBoostsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // BOOSTS -> PRELIMINARY_RESULTS
  if (nextPhase === ESQUIADORES_PHASES.PRELIMINARY_RESULTS) {
    const newPhase = await preparePreliminaryResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // PRELIMINARY_RESULTS -> LAST_CHANGE
  if (nextPhase === ESQUIADORES_PHASES.LAST_CHANGE) {
    const newPhase = await prepareLastChangePhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // LAST_CHANGE -> FINAL_RESULTS
  if (nextPhase === ESQUIADORES_PHASES.FINAL_RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === ESQUIADORES_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: EsquiadoresSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ESQUIADORES_ACTIONS.SUBMIT_BETS:
      validateSubmitActionProperties(data, ['bets', 'betType'], 'submit bets');
      return handleSubmitBets(gameName, gameId, playerId, data.bets, data.betType);
    case ESQUIADORES_ACTIONS.SUBMIT_CHOICES:
      validateSubmitActionProperties(data, ['choices'], 'submit choices');
      return handleSubmitChoices(gameName, gameId, playerId, data.choices);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
