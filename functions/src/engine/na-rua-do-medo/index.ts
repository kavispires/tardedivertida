// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { NA_RUA_DO_MEDO_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type { GameId, GameName, Language, Players } from '../../utils/types';
import type { NoRuaDoMedoInitialState, NoRuaDoMedoOptions, NaRuaDoMedoSubmitAction } from './types';
// Utilities
import * as utils from '../../utils';
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
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.NA_RUA_DO_MEDO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: NA_RUA_DO_MEDO_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
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
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine if it's game over
  const outcome = determineOutcome(store, state, players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, outcome, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, newPhase.update?.players ?? {});
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
export const submitAction = async (data: NaRuaDoMedoSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_DECISION':
      utils.firebase.validateSubmitActionProperties(data, ['decision'], 'submit decision');
      return handleSubmitDecision(collectionName, gameId, playerId, data.decision);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
