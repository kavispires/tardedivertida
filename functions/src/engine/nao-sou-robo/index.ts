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
import { handleSubmitCard, handleSubmitCardGuess } from './actions';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareCardSelectionPhase,
  prepareAreYouARobotPhase,
  prepareResultsPhase,
} from './setup';
import { getResourceData } from './data';

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
  options: NaoSouRoboOptions,
): NaoSouRoboInitialState => {
  return utils.helpers.getDefaultInitialState<NaoSouRoboInitialState>({
    gameId,
    gameName: GAME_NAMES.NAO_SOU_ROBO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: NAO_SOU_ROBO_PHASES.LOBBY,
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
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: NaoSouRoboSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case NAO_SOU_ROBO_ACTIONS.SUBMIT_CARD:
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'submit card');
      return handleSubmitCard(gameName, gameId, playerId, data.cardId);
    case NAO_SOU_ROBO_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitCardGuess(gameName, gameId, playerId, data.guess);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
