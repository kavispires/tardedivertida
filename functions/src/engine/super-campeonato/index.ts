// Constants
import { GAME_NAMES } from '../../utils/constants';
import { TOTAL_ROUNDS, PLAYER_COUNTS, SUPER_CAMPEONATO_PHASES, SUPER_CAMPEONATO_ACTIONS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  SuperCampeonatoInitialState,
  SuperCampeonatoOptions,
  SuperCampeonatoSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import {
  handleSubmitBets,
  handleSubmitChallenge,
  handleSubmitContenders,
  handleSubmitVotes,
} from './actions';
import {
  prepareBattlePhase,
  prepareBetsPhase,
  prepareChallengeSelectionPhase,
  prepareContenderSelectionPhase,
  prepareGameOverPhase,
  prepareResultsPhase,
  prepareSetupPhase,
} from './setup';

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
  options: SuperCampeonatoOptions
): SuperCampeonatoInitialState => {
  return utils.helpers.getDefaultInitialState<SuperCampeonatoInitialState>({
    gameId,
    gameName: GAME_NAMES.SUPER_CAMPEONATO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: SUPER_CAMPEONATO_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      gameOrder: [],
    },
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state.round,
    state?.tier,
    store.options?.autoContenders ?? false
  );

  // RULES -> SETUP
  if (nextPhase === SUPER_CAMPEONATO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(
      store.language,
      utils.players.getPlayerCount(players),
      !!store.options?.nsfw
    );
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CHALLENGE_SELECTION
  if (nextPhase === SUPER_CAMPEONATO_PHASES.CHALLENGE_SELECTION) {
    const newPhase = await prepareChallengeSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CHALLENGE_SELECTION -> CONTENDER_SELECTION
  if (nextPhase === SUPER_CAMPEONATO_PHASES.CONTENDER_SELECTION) {
    const newPhase = await prepareContenderSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CONTENDER_SELECTION -> BETS
  if (nextPhase === SUPER_CAMPEONATO_PHASES.BETS) {
    const newPhase = await prepareBetsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> BATTLE
  if (nextPhase === SUPER_CAMPEONATO_PHASES.BATTLE) {
    const newPhase = await prepareBattlePhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> RESULTS
  if (nextPhase === SUPER_CAMPEONATO_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === SUPER_CAMPEONATO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: SuperCampeonatoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case SUPER_CAMPEONATO_ACTIONS.SUBMIT_CHALLENGE:
      utils.firebase.validateSubmitActionProperties(data, ['challengeId'], 'submit challenge');
      return handleSubmitChallenge(gameName, gameId, playerId, data.challengeId);
    case SUPER_CAMPEONATO_ACTIONS.SUBMIT_CONTENDERS:
      utils.firebase.validateSubmitActionProperties(data, ['contendersId'], 'submit contenders');
      return handleSubmitContenders(gameName, gameId, playerId, data.contendersId);
    case SUPER_CAMPEONATO_ACTIONS.SUBMIT_BETS:
      utils.firebase.validateSubmitActionProperties(data, ['quarter', 'semi', 'final'], 'submit bets');
      return handleSubmitBets(gameName, gameId, playerId, data.quarter, data.semi, data.final);
    case SUPER_CAMPEONATO_ACTIONS.SUBMIT_VOTES:
      utils.firebase.validateSubmitActionProperties(data, ['votes'], 'submit bets');
      return handleSubmitVotes(gameName, gameId, playerId, data.votes);
    default:
      utils.firestore.throwException(`Given action ${action} is not allowed`);
  }
};
