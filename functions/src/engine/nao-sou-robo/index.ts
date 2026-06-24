// Constants
import { GAME_NAMES } from '../../utils/constants';
import { PLAYER_COUNTS, NAO_SOU_ROBO_PHASES, NAO_SOU_ROBO_ACTIONS, MAX_ROUNDS, OUTCOME } from './constants';
// Types
import type {
  NaoSouRoboInitialState,
  NaoSouRoboOptions,
  NaoSouRoboSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { handleSubmitCards, handleSubmitCardGuess } from './actions';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareCardSelectionPhase,
  prepareAreYouARobotPhase,
  prepareResultsPhase,
} from './setup';
import { getResourceData } from './data';
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';

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
  options: NaoSouRoboOptions,
): NaoSouRoboInitialState => {
  return utils.game.getDefaultInitialState<NaoSouRoboInitialState>({
    gameId,
    gameName: GAME_NAMES.NAO_SOU_ROBO,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state.round, state.outcome ?? OUTCOME.CONTINUE);

  // LOBBY -> SETUP
  if (nextPhase === NAO_SOU_ROBO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, utils.players.getPlayerCount(players));

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> CARD_SELECTION
  if (nextPhase === NAO_SOU_ROBO_PHASES.CARD_SELECTION) {
    const newPhase = await prepareCardSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CARD_SELECTION -> ARE_YOU_A_ROBOT
  if (nextPhase === NAO_SOU_ROBO_PHASES.ARE_YOU_A_ROBOT) {
    const newPhase = await prepareAreYouARobotPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // ARE_YOU_A_ROBOT -> RESULTS
  if (nextPhase === NAO_SOU_ROBO_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === NAO_SOU_ROBO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: NaoSouRoboSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case NAO_SOU_ROBO_ACTIONS.SUBMIT_CARDS:
      validateSubmitActionProperties(data, ['cardIds'], 'submit cards');
      return handleSubmitCards(gameName, gameId, playerId, data.cardIds);
    case NAO_SOU_ROBO_ACTIONS.SUBMIT_GUESS:
      validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitCardGuess(gameName, gameId, playerId, data.guess);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
