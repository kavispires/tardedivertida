// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ESCAPE_ROOM_ACTIONS, ESCAPE_ROOM_PHASES, OUTCOME, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  EscapeRoomInitialState,
  EscapeRoomOptions,
  EscapeRoomSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareMissionPhase,
  prepareMissionEvaluationPhase,
  prepareResultsPhase,
} from './setup';
import { getEpisode } from './data';
import { handleSubmitCard } from './actions';

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
  options: EscapeRoomOptions,
): EscapeRoomInitialState => {
  return utils.helpers.getDefaultInitialState<EscapeRoomInitialState>({
    gameId,
    gameName: GAME_NAMES.ESCAPE_ROOM,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ESCAPE_ROOM_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.outcome ?? OUTCOME.CONTINUE);

  // LOBBY -> SETUP
  if (nextPhase === ESCAPE_ROOM_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getEpisode(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> MISSION
  if (nextPhase === ESCAPE_ROOM_PHASES.MISSION) {
    const newPhase = await prepareMissionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> MISSION_EVALUATION
  if (nextPhase === ESCAPE_ROOM_PHASES.MISSION_EVALUATION) {
    const newPhase = await prepareMissionEvaluationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // MISSION_EVALUATION -> RESULTS
  if (nextPhase === ESCAPE_ROOM_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === ESCAPE_ROOM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: EscapeRoomSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ESCAPE_ROOM_ACTIONS.SUBMIT_CARD_PLAY:
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'submit card play');
      return handleSubmitCard(gameName, gameId, playerId, data.cardId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
