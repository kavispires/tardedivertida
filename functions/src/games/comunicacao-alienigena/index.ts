// Types
import type {
  ComunicacaoAlienigenaInitialState,
  ComunicacaoAlienigenaOptions,
  ComunicacaoAlienigenaState,
  ComunicacaoAlienigenaStore,
  ComunicacaoAlienigenaSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  PLAYER_COUNTS,
  COMUNICACAO_ALIENIGENA_PHASES,
  COMUNICACAO_ALIENIGENA_ACTIONS,
  MAX_ROUNDS,
} from './constants';
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
  handleConfirmNotes,
  handleSubmitAlien,
  handleSubmitAlienRequest,
  handleSubmitAlienResponses,
  handleSubmitHumanInquiry,
  handleSubmitOfferings,
  handleSubmitSeeds,
} from './actions';
import { getResourceData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareAlienSelectionPhase,
  prepareHumanAskPhase,
  prepareAlienAnswerPhase,
  prepareAlienRequestPhase,
  prepareOfferingsPhase,
  prepareRevealPhase,
  prepareAlienSeedingPhase,
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
  options: ComunicacaoAlienigenaOptions,
): ComunicacaoAlienigenaInitialState => {
  return utils.game.getDefaultInitialState<ComunicacaoAlienigenaInitialState>({
    gameId,
    gameName: GAME_NAMES.COMUNICACAO_ALIENIGENA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {},
    options,
    onCreate: () => {
      const players: Players = {};
      if (options.botAlien) {
        utils.players.addBots(players, language, 1, { role: 'alien', avatarId: 'T', name: 'Alien-Bot' });
      }
      return {
        players,
      };
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
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state as ComunicacaoAlienigenaState,
    store as ComunicacaoAlienigenaStore,
  );

  // LOBBY -> SETUP
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(
      store.language,
      utils.players.getPlayerCount(players),
      store.options ?? {},
    );

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> ALIEN_SELECTION
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SELECTION) {
    const newPhase = await prepareAlienSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // SETUP -> ALIEN_SELECTION
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SEEDING) {
    const newPhase = await prepareAlienSeedingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> HUMANS_SASK
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.HUMANS_ASKS) {
    const newPhase = await prepareHumanAskPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // HUMANS_SASK -> ALIEN_ANSWER
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER) {
    const newPhase = await prepareAlienAnswerPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // ALIEN_ANSWER -> ALIEN_REQUEST
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST) {
    const newPhase = await prepareAlienRequestPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // ALIEN_REQUEST -> OFFERINGS
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.OFFERINGS) {
    const newPhase = await prepareOfferingsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // OFFERINGS -> REVEAL
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ComunicacaoAlienigenaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN:
      validateSubmitActionProperties(data, ['alienId'], 'submit alienId');
      return handleSubmitAlien(gameName, gameId, playerId, data.alienId);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_SEEDS:
      validateSubmitActionProperties(data, ['seeds'], 'submit seeds');
      return handleSubmitSeeds(gameName, gameId, playerId, data.seeds);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_HUMAN_INQUIRY:
      validateSubmitActionProperties(data, ['objectsIds', 'intention'], 'submit objectsIds');
      return handleSubmitHumanInquiry(gameName, gameId, playerId, data.objectsIds, data.intention);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_RESPONSES:
      validateSubmitActionProperties(data, ['alienResponses'], 'submit alienResponses');
      return handleSubmitAlienResponses(gameName, gameId, playerId, data.alienResponses);
    case COMUNICACAO_ALIENIGENA_ACTIONS.CONFIRM_NOTES:
      validateSubmitActionProperties(data, ['notes'], 'submit notes');
      return handleConfirmNotes(gameName, gameId, playerId, data.notes);

    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_REQUEST:
      validateSubmitActionProperties(data, ['alienRequest', 'intention'], 'submit alienRequest');
      return handleSubmitAlienRequest(gameName, gameId, playerId, data.alienRequest, data.intention);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_OFFERINGS:
      validateSubmitActionProperties(data, ['offeringsIds'], 'submit offeringsIds');
      return handleSubmitOfferings(gameName, gameId, playerId, data.offeringsIds);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
