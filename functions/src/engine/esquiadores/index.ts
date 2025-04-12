// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ESQUIADORES_ACTIONS, ESQUIADORES_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type {
  EsquiadoresInitialState,
  EsquiadoresOptions,
  EsquiadoresSubmitAction,
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
  prepareBetsPhase,
  prepareStartingResultsPhase,
  prepareBoostsPhase,
  preparePreliminaryResultsPhase,
  prepareLastChangePhase,
  prepareSetupPhase,
} from './setup';
import { getDilemmas } from './data';
import { handleSubmitChoices, handleSubmitBets } from './actions';

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
  options: EsquiadoresOptions,
): EsquiadoresInitialState => {
  return utils.helpers.getDefaultInitialState<EsquiadoresInitialState>({
    gameId,
    gameName: GAME_NAMES.ESQUIADORES,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ESQUIADORES_PHASES.LOBBY,
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
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === ESQUIADORES_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getDilemmas(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> BETS
  if (nextPhase === ESQUIADORES_PHASES.BETS) {
    const newPhase = await prepareBetsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // BETS -> STARTING_RESULTS
  if (nextPhase === ESQUIADORES_PHASES.STARTING_RESULTS) {
    const newPhase = await prepareStartingResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // STARTING_RESULTS -> BOOSTS
  if (nextPhase === ESQUIADORES_PHASES.BOOSTS) {
    const newPhase = await prepareBoostsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // BOOSTS -> PRELIMINARY_RESULTS
  if (nextPhase === ESQUIADORES_PHASES.PRELIMINARY_RESULTS) {
    const newPhase = await preparePreliminaryResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PRELIMINARY_RESULTS -> LAST_CHANGE
  if (nextPhase === ESQUIADORES_PHASES.LAST_CHANGE) {
    const newPhase = await prepareLastChangePhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // LAST_CHANGE -> FINAL_RESULTS
  if (nextPhase === ESQUIADORES_PHASES.FINAL_RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === ESQUIADORES_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles bets submissions
 * May trigger next phase
 */
export const submitAction = async (data: EsquiadoresSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ESQUIADORES_ACTIONS.SUBMIT_BETS:
      utils.firebase.validateSubmitActionProperties(data, ['bets', 'betType'], 'submit bets');
      return handleSubmitBets(gameName, gameId, playerId, data.bets, data.betType);
    case ESQUIADORES_ACTIONS.SUBMIT_CHOICES:
      utils.firebase.validateSubmitActionProperties(data, ['choices'], 'submit choices');
      return handleSubmitChoices(gameName, gameId, playerId, data.choices);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
