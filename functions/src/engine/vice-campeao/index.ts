// Constants
import { GAME_NAMES } from '../../utils/constants';
import { VICE_CAMPEAO_ACTIONS, VICE_CAMPEAO_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  ViceCampeaoInitialState,
  ViceCampeaoOptions,
  ViceCampeaoSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import { prepareSetupPhase, prepareCardSelectionPhase, prepareRunPhase, prepareGameOverPhase } from './setup';
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
  options: ViceCampeaoOptions = {},
): ViceCampeaoInitialState => {
  return utils.helpers.getDefaultInitialState<ViceCampeaoInitialState>({
    gameId,
    gameName: GAME_NAMES.VICE_CAMPEAO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: VICE_CAMPEAO_PHASES.LOBBY,
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
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === VICE_CAMPEAO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(utils.players.getPlayerCount(players));
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> WORD_CREATION
  if (nextPhase === VICE_CAMPEAO_PHASES.CARD_SELECTION) {
    const newPhase = await prepareCardSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // WORD_CREATION -> GUESSING
  if (nextPhase === VICE_CAMPEAO_PHASES.RUN) {
    const newPhase = await prepareRunPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === VICE_CAMPEAO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: ViceCampeaoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case VICE_CAMPEAO_ACTIONS.SUBMIT_CARD:
      utils.firebase.validateSubmitActionProperties(data, ['cardId', 'targetId'], 'submit card');
      return handleSubmitCard(gameName, gameId, playerId, data.cardId, data.targetId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
