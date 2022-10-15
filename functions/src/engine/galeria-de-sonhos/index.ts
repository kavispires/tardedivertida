// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  GALERIA_DE_SONHOS_ACTIONS,
  GALERIA_DE_SONHOS_PHASES,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type {
  GaleriaDeSonhosInitialState,
  GaleriaDeSonhosOptions,
  GaleriaDeSonhosSubmitAction,
} from './types';
// Utils
import * as utils from '../../utils';
import { determineNextPhase } from './helpers';
// Internal Functions
import {
  prepareCardPlayPhase,
  prepareDreamsSelectionPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareSetupPhase,
  prepareWordSelectionPhase,
} from './setup';
import { handlePlayCard, handleSubmitCards, handleSubmitWord } from './actions';
import { getWords } from './data';

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
  options: GaleriaDeSonhosOptions
): GaleriaDeSonhosInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_NAMES.GALERIA_DE_SONHOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: GALERIA_DE_SONHOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      gameOrder: [],
      tableDeck: [],
      wordsDeck: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (gameName: string, gameId: string, players: Players): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    gameName,
    gameId,
    actionText
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, players);
  }

  // * -> WORD_SELECTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> DREAMS_SELECTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.DREAMS_SELECTION) {
    const newPhase = await prepareDreamsSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DREAMS_SELECTION -> CARD_PLAY
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> RESOLUTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles cards submissions
 * May trigger next phase
 */
export const submitAction = async (data: GaleriaDeSonhosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case GALERIA_DE_SONHOS_ACTIONS.SUBMIT_WORD:
      utils.firebase.validateSubmitActionProperties(data, ['wordId'], 'submit word');
      return handleSubmitWord(gameName, gameId, playerId, data.wordId);
    case GALERIA_DE_SONHOS_ACTIONS.SUBMIT_CARDS:
      utils.firebase.validateSubmitActionProperties(data, ['cardsIds'], 'submit cards');
      return handleSubmitCards(gameName, gameId, playerId, data.cardsIds);
    case GALERIA_DE_SONHOS_ACTIONS.PLAY_CARD:
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(gameName, gameId, playerId, data.cardId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
