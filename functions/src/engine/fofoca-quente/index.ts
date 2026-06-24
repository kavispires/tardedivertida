// Types
import type {
  FofocaQuenteInitialState,
  FofocaQuenteOptions,
  FofocaQuenteSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import { FOFOCA_QUENTE_ACTIONS, FOFOCA_QUENTE_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
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
import {
  handleSubmitPlayersRoles,
  handleSubmitAssociatedSocialGroup,
  handleSubmitDetectiveLocation,
  handleSubmitIntimidation,
  handleSubmitRumor,
} from './actions';
import { getData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGossiperSelectionPhase,
  prepareBoardSetupPhase,
  prepareIntimidationPhase,
  prepareRumorPhase,
  prepareResponsePhase,
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
  options: FofocaQuenteOptions,
): FofocaQuenteInitialState => {
  return utils.game.getDefaultInitialState<FofocaQuenteInitialState>({
    gameId,
    gameName: GAME_NAMES.FOFOCA_QUENTE,
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.nextPhase);

  // LOBBY -> SETUP
  if (nextPhase === FOFOCA_QUENTE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> GOSSIPER_SELECTION
  if (nextPhase === FOFOCA_QUENTE_PHASES.ROLES_SELECTION) {
    const newPhase = await prepareGossiperSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> BOARD_SETUP
  if (nextPhase === FOFOCA_QUENTE_PHASES.BOARD_SETUP) {
    const newPhase = await prepareBoardSetupPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> INTIMIDATION
  if (nextPhase === FOFOCA_QUENTE_PHASES.INTIMIDATION) {
    const newPhase = await prepareIntimidationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // INTIMIDATION -> RUMOR
  if (nextPhase === FOFOCA_QUENTE_PHASES.RUMOR) {
    const newPhase = await prepareRumorPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RUMOR -> RESPONSE
  if (nextPhase === FOFOCA_QUENTE_PHASES.RESPONSE) {
    const newPhase = await prepareResponsePhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // // RESPONSE -> INVESTIGATION
  // if (nextPhase === FOFOCA_QUENTE_PHASES.INVESTIGATION) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return saveGame(sessionRef, newPhase);
  // }

  // // * -> SCHOOL
  // if (nextPhase === FOFOCA_QUENTE_PHASES.SCHOOL) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return saveGame(sessionRef, newPhase);
  // }

  // // * -> RESOLUTION
  // if (nextPhase === FOFOCA_QUENTE_PHASES.RESOLUTION) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return saveGame(sessionRef, newPhase);
  // }

  // // * -> GAME_OVER
  // if (nextPhase === FOFOCA_QUENTE_PHASES.GAME_OVER) {
  //   const newPhase = await preparePhase(store, state, players);
  //   return saveGame(sessionRef, newPhase);
  // }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: FofocaQuenteSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_PLAYERS_ROLES:
      validateSubmitActionProperties(data, ['gossiperPlayerId', 'detectivePlayerId'], 'submit players roles');
      return handleSubmitPlayersRoles(
        gameName,
        gameId,
        playerId,
        data.gossiperPlayerId,
        data.detectivePlayerId,
      );
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_SOCIAL_GROUP:
      validateSubmitActionProperties(data, ['associatedSocialGroupId'], 'submit associated Social Group');
      return handleSubmitAssociatedSocialGroup(gameName, gameId, playerId, data.associatedSocialGroupId);
    case FOFOCA_QUENTE_ACTIONS.UPDATE_DETECTIVE_POSITION:
      validateSubmitActionProperties(data, ['locationIndex'], 'submit detective position');
      return handleSubmitDetectiveLocation(gameName, gameId, playerId, data.locationIndex, data.shouldReady);
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_INTIMIDATION:
      validateSubmitActionProperties(data, ['intimidatedStudentId'], 'submit intimidation');
      return handleSubmitIntimidation(
        gameName,
        gameId,
        playerId,
        data.intimidatedStudentId,
        data.intimidatedStudentsIds,
        data.shouldGoToTheNextPhase,
      );
    case FOFOCA_QUENTE_ACTIONS.SUBMIT_RUMOR:
      validateSubmitActionProperties(data, ['skipRumor'], 'submit rumor');
      return handleSubmitRumor(
        gameName,
        gameId,
        playerId,
        data.skipRumor,
        data.rumoredStudentId,
        data.rumorIndex,
      );

    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
