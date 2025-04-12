// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ESPIAO_ENTRE_NOS_ACTIONS, ESPIAO_ENTRE_NOS_PHASES, PLAYER_COUNTS } from './constants';
// Types
import type {
  EspiaoEntreNosInitialState,
  EspiaoEntreNosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
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
  language: Language,
  version: string,
): EspiaoEntreNosInitialState => {
  return utils.helpers.getDefaultInitialState<EspiaoEntreNosInitialState>({
    gameId,
    gameName: GAME_NAMES.ESPIAO_ENTRE_NOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ESPIAO_ENTRE_NOS_PHASES.LOBBY,
    totalRounds: 0,
    store: {
      usedCards: [],
      gameOrder: [],
      turnOrder: [],
    },
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
  const outcome = checkOutcome(state, store, players);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, outcome);

  // LOBBY -> SETUP
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getLocations(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ASSIGNMENT
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.ASSIGNMENT) {
    const newPhase = await prepareAssignmentPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // ASSIGNMENT -> INVESTIGATION
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.INVESTIGATION) {
    const newPhase = await prepareInvestigationPhase(store, state, players, outcome);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // INVESTIGATION -> ASSESSMENT
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT) {
    const newPhase = await prepareAssessmentPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> FINAL_ASSESSMENT
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.FINAL_ASSESSMENT) {
    const newPhase = await prepareFinalAssessmentPhase(store, state, players, outcome);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // VOTING -> RESOLUTION
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * --> GAME_OVER
  if (nextPhase === ESPIAO_ENTRE_NOS_PHASES.GAME_OVER) {
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
export const submitAction = async (data: EspiaoEntreNosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ESPIAO_ENTRE_NOS_ACTIONS.LAST_QUESTIONER:
      utils.firebase.validateSubmitActionProperties(data, ['lastPlayerId'], 'change timer');
      return handleLastQuestioner(gameName, gameId, playerId, data.lastPlayerId);
    case ESPIAO_ENTRE_NOS_ACTIONS.MAKE_ACCUSATION:
      utils.firebase.validateSubmitActionProperties(data, ['targetId'], 'make an accusation');
      return handleMakeAccusation(gameName, gameId, playerId, data.targetId);
    case ESPIAO_ENTRE_NOS_ACTIONS.GUESS_LOCATION:
      utils.firebase.validateSubmitActionProperties(data, ['locationId'], 'guess location');
      return handleGuessLocation(gameName, gameId, playerId, data.locationId);
    case ESPIAO_ENTRE_NOS_ACTIONS.SUBMIT_VOTE:
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(gameName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
