// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { QUEM_NAO_MATA_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type { QuemNaoMataInitialState, NaRuaDoMedoSubmitAction } from './types';
// Utilities
import * as utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareDuelPhase,
  prepareStandoffPhase,
  prepareTargetingPhase,
} from './setup';
import { handleSubmitDecision } from './actions';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (gameId: GameId, uid: string, language: Language): QuemNaoMataInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.QUEM_NAO_MATA,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: QUEM_NAO_MATA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
    },
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === QUEM_NAO_MATA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, newPhase.update?.players ?? {});
  }

  // SETUP/STANDOFF/RESOLUTION -> TARGETING
  if (nextPhase === QUEM_NAO_MATA_PHASES.TARGETING) {
    const newPhase = await prepareTargetingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // TARGETING -> STANDOFF
  if (nextPhase === QUEM_NAO_MATA_PHASES.STANDOFF) {
    const newPhase = await prepareStandoffPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // STANDOFF -> DUEL
  if (nextPhase === QUEM_NAO_MATA_PHASES.DUEL) {
    const newPhase = await prepareDuelPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DUEL -> RESOLUTION
  if (nextPhase === QUEM_NAO_MATA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // STREET_END -> GAME_OVER
  if (nextPhase === QUEM_NAO_MATA_PHASES.GAME_OVER) {
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
