// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { ESPIAO_ENTRE_NOS_PHASES, PLAYER_COUNTS } from './constants';
// Types
import type { GameId, Language, Players } from '../../utils/types';
import type { EspiaoEntreNosInitialState, EspiaoEntreNosSubmitAction } from './types';
// Utils
import * as utils from '../../utils';
import {
  prepareAssessmentPhase,
  prepareAssignmentPhase,
  prepareFinalAssessmentPhase,
  prepareGameOverPhase,
  prepareInvestigationPhase,
  prepareResolutionPhase,
  prepareSetupPhase,
} from './setup';
import { handleLastQuestioner, handleGuessLocation, handleMakeAccusation, handleSubmitVote } from './actions';
import { checkOutcome, determineNextPhase } from './helpers';
import { getLocations } from './data';

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
): EspiaoEntreNosInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.ESPIAO_ENTRE_NOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ESPIAO_ENTRE_NOS_PHASES.LOBBY,
    totalRounds: 0,
    store: {
      language,
      usedCards: [],
      gameOrder: [],
      turnOrder: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine next phase
  const outcome = checkOutcome(state, store, players);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, outcome, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getLocations(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // * -> ASSIGNMENT
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.ASSIGNMENT) {
    const newPhase = await prepareAssignmentPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // ASSIGNMENT -> INVESTIGATION
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.INVESTIGATION) {
    const newPhase = await prepareInvestigationPhase(store, state, players, outcome);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // INVESTIGATION -> ASSESSMENT
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT) {
    const newPhase = await prepareAssessmentPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> FINAL_ASSESSMENT
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.FINAL_ASSESSMENT) {
    const newPhase = await prepareFinalAssessmentPhase(store, state, players, outcome);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // VOTING -> RESOLUTION
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * --> GAME_OVER
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.GAME_OVER) {
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
export const submitAction = async (data: EspiaoEntreNosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'LAST_QUESTIONER':
      utils.firebase.validateSubmitActionProperties(data, ['lastPlayerId'], 'change timer');
      return handleLastQuestioner(collectionName, gameId, playerId, data.lastPlayerId);
    case 'MAKE_ACCUSATION':
      utils.firebase.validateSubmitActionProperties(data, ['targetId'], 'make an accusation');
      return handleMakeAccusation(collectionName, gameId, playerId, data.targetId);
    case 'GUESS_LOCATION':
      utils.firebase.validateSubmitActionProperties(data, ['locationId'], 'guess location');
      return handleGuessLocation(collectionName, gameId, playerId, data.locationId);
    case 'SUBMIT_VOTE':
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
