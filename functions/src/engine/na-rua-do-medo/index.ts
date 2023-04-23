// Constants
import { GAME_NAMES } from '../../utils/constants';
import { NA_RUA_DO_MEDO_PHASES, PLAYER_COUNTS, MAX_ROUNDS, NA_RUA_DO_MEDO_ACTIONS } from './constants';
// Types
import type {
  NoRuaDoMedoInitialState,
  NoRuaDoMedoOptions,
  NaRuaDoMedoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineOutcome, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareTrickOrTreatPhase,
  prepareResultPhase,
  prepareStreetEndPhase,
  prepareGameOverPhase,
} from './setup';
import { handleSubmitDecision } from './actions';

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
  options: NoRuaDoMedoOptions
): NoRuaDoMedoInitialState => {
  return utils.helpers.getDefaultInitialState<NoRuaDoMedoInitialState>({
    gameId,
    gameName: GAME_NAMES.NA_RUA_DO_MEDO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: NA_RUA_DO_MEDO_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      horrorDeck: [],
      jackpotDeck: [],
      candyDeck: [],
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
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);
  const players = state.players;

  // Determine if it's game over
  const outcome = determineOutcome(store, state, players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, outcome);
  // RULES -> SETUP
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, newPhase?.update?.state as FirebaseStateData);
  }

  // * -> TRICK_OR_TREAT
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.TRICK_OR_TREAT) {
    const newPhase = await prepareTrickOrTreatPhase(store, state, players, outcome);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // TRICK_OR_TREAT -> RESULT
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // TRICK_OR_TREAT -> STREET_END
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.STREET_END) {
    const newPhase = await prepareStreetEndPhase(store, state, players, outcome);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // STREET_END -> GAME_OVER
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.GAME_OVER) {
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
export const submitAction = async (data: NaRuaDoMedoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case NA_RUA_DO_MEDO_ACTIONS.SUBMIT_DECISION:
      utils.firebase.validateSubmitActionProperties(data, ['decision'], 'submit decision');
      return handleSubmitDecision(gameName, gameId, playerId, data.decision);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
