// Constants
import { GAME_NAMES } from '../../utils/constants';
import { TOTAL_ROUNDS, PLAYER_COUNTS, QUEM_SOU_EU_PHASES, QUEM_SOU_EU_ACTIONS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  QuemSouEuInitialState,
  QuemSouEuOptions,
  QuemSouEuSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import { handleSubmitCharacters, handleSubmitGlyphs, handleSubmitGuesses } from './actions';
import {
  prepareSetupPhase,
  prepareCharacterFilteringPhase,
  prepareCharacterDescriptionPhase,
  prepareGuessingPhase,
  prepareResultsPhase,
  prepareGameOverPhase,
} from './setup';

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
  options: QuemSouEuOptions
): QuemSouEuInitialState => {
  return utils.helpers.getDefaultInitialState<QuemSouEuInitialState>({
    gameId,
    gameName: GAME_NAMES.QUEM_SOU_EU,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: QUEM_SOU_EU_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round);

  // RULES -> SETUP
  if (nextPhase === QUEM_SOU_EU_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, utils.players.getPlayerCount(players));
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, newPhase?.update?.state as FirebaseStateData);
  }

  // SETUP -> CHARACTER_FILTERING
  if (nextPhase === QUEM_SOU_EU_PHASES.CHARACTER_FILTERING) {
    const newPhase = await prepareCharacterFilteringPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> CHARACTER_DESCRIPTION
  if (nextPhase === QUEM_SOU_EU_PHASES.CHARACTER_DESCRIPTION) {
    const newPhase = await prepareCharacterDescriptionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CHARACTER_DESCRIPTION -> GUESSING
  if (nextPhase === QUEM_SOU_EU_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> RESULTS
  if (nextPhase === QUEM_SOU_EU_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === QUEM_SOU_EU_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: QuemSouEuSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case QUEM_SOU_EU_ACTIONS.SUBMIT_CHARACTERS:
      utils.firebase.validateSubmitActionProperties(data, ['characters'], 'submit characters');
      return handleSubmitCharacters(gameName, gameId, playerId, data.characters);
    case QUEM_SOU_EU_ACTIONS.SUBMIT_GLYPHS:
      utils.firebase.validateSubmitActionProperties(data, ['glyphs'], 'submit glyphs');
      return handleSubmitGlyphs(gameName, gameId, playerId, data.glyphs);
    case QUEM_SOU_EU_ACTIONS.SUBMIT_GUESSES:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
