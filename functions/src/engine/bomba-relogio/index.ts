// Constants
import { GAME_NAMES } from '../../utils/constants';
import { BOMBA_RELOGIO_ACTIONS, BOMBA_RELOGIO_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  BombaRelogioInitialState,
  BombaRelogioSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareDeclarationPhase,
  prepareExaminationPhase,
  prepareGameOverPhase,
} from './setup';
import { handleSubmitDeclarations, handleSubmitTarget, handleUpdateTargetPlayer } from './actions';

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
): BombaRelogioInitialState => {
  return utils.game.getDefaultInitialState<BombaRelogioInitialState>({
    gameId,
    gameName: GAME_NAMES.BOMBA_RELOGIO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.status);

  // LOBBY -> SETUP
  if (nextPhase === BOMBA_RELOGIO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> DECLARATION
  if (nextPhase === BOMBA_RELOGIO_PHASES.DECLARATION) {
    const newPhase = await prepareDeclarationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // DECLARATION -> EXAMINATION
  if (nextPhase === BOMBA_RELOGIO_PHASES.EXAMINATION) {
    const newPhase = await prepareExaminationPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // EXAMINATION -> GAME_OVER
  if (nextPhase === BOMBA_RELOGIO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: BombaRelogioSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case BOMBA_RELOGIO_ACTIONS.SUBMIT_DECLARATION:
      utils.firebase.validateSubmitActionProperties(data, ['declarations'], 'submit declarations');
      return handleSubmitDeclarations(gameName, gameId, playerId, data.declarations);
    case BOMBA_RELOGIO_ACTIONS.UPDATE_TARGET_PLAYER:
      utils.firebase.validateSubmitActionProperties(data, ['targetPlayerId'], 'update target player');
      return handleUpdateTargetPlayer(gameName, gameId, playerId, data.targetPlayerId);
    case BOMBA_RELOGIO_ACTIONS.SUBMIT_TARGET:
      utils.firebase.validateSubmitActionProperties(data, ['target'], 'submit target');
      return handleSubmitTarget(gameName, gameId, playerId, data.target);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
