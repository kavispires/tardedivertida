// Constants
import { GAME_NAMES } from '../../utils/constants';
import { FOFOCA_QUENTE_ACTIONS, FOFOCA_QUENTE_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type {
  FofocaQuenteInitialState,
  FofocaQuenteOptions,
  FofocaQuenteSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGossiperSelectionPhase,
  prepareBoardSetupPhase,
  prepareIntimidationPhase,
  prepareRumorPhase,
} from './setup';
import { getData } from './data';
import {
  handleSubmitPlayersRoles,
  handleSubmitAssociatedSocialGroup,
  handleSubmitDetectiveLocation,
  handleSubmitIntimidation,
} from './actions';

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
  options: FofocaQuenteOptions,
): FofocaQuenteInitialState => {
  return utils.helpers.getDefaultInitialState<FofocaQuenteInitialState>({
    gameId,
    gameName: GAME_NAMES.FOFOCA_QUENTE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: FOFOCA_QUENTE_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.nextPhase);

  // RULES -> SETUP
  if (nextPhase === FOFOCA_QUENTE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> GOSSIPER_SELECTION
  if (nextPhase === FOFOCA_QUENTE_PHASES.ROLES_SELECTION) {
    const newPhase = await prepareGossiperSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> BOARD_SETUP
  if (nextPhase === FOFOCA_QUENTE_PHASES.BOARD_SETUP) {
    const newPhase = await prepareBoardSetupPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> INTIMIDATION
  if (nextPhase === FOFOCA_QUENTE_PHASES.INTIMIDATION) {
    const newPhase = await prepareIntimidationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> RUMOR
  if (nextPhase === FOFOCA_QUENTE_PHASES.RUMOR) {
    const newPhase = await prepareRumorPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // // * -> RESPONSE
  // if (nextPhase === FOFOCA_QUENTE_PHASES.RESPONSE) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return utils.firestore.saveGame(sessionRef, newPhase);
  // }

  // // * -> INVESTIGATION
  // if (nextPhase === FOFOCA_QUENTE_PHASES.INVESTIGATION) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return utils.firestore.saveGame(sessionRef, newPhase);
  // }

  // // * -> SCHOOL
  // if (nextPhase === FOFOCA_QUENTE_PHASES.SCHOOL) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return utils.firestore.saveGame(sessionRef, newPhase);
  // }

  // // * -> RESOLUTION
  // if (nextPhase === FOFOCA_QUENTE_PHASES.RESOLUTION) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return utils.firestore.saveGame(sessionRef, newPhase);
  // }

  // // * -> GAME_OVER
  // if (nextPhase === FOFOCA_QUENTE_PHASES.GAME_OVER) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return utils.firestore.saveGame(sessionRef, newPhase);
  // }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: FofocaQuenteSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_PLAYERS_ROLES:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['gossiperPlayerId', 'detectivePlayerId'],
        'submit players roles',
      );
      return handleSubmitPlayersRoles(
        gameName,
        gameId,
        playerId,
        data.gossiperPlayerId,
        data.detectivePlayerId,
      );
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_SOCIAL_GROUP:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['associatedSocialGroupId'],
        'submit associated Social Group',
      );
      return handleSubmitAssociatedSocialGroup(gameName, gameId, playerId, data.associatedSocialGroupId);
    case FOFOCA_QUENTE_ACTIONS.UPDATE_DETECTIVE_POSITION:
      utils.firebase.validateSubmitActionProperties(data, ['locationId'], 'submit detective position');
      return handleSubmitDetectiveLocation(gameName, gameId, playerId, data.locationId, data.shouldReady);
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_INTIMIDATION:
      utils.firebase.validateSubmitActionProperties(data, ['intimidatedStudentId'], 'submit intimidation');
      return handleSubmitIntimidation(
        gameName,
        gameId,
        playerId,
        data.intimidatedStudentId,
        data.shouldGoToTheNextPhase,
      );

    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
