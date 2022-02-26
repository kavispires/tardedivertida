// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { GALERIA_DE_SONHOS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import { GameId, Language, Players } from '../../utils/types';
import { GaleriaDeSonhosInitialState, GaleriaDeSonhosSubmitAction } from './types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
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
  language: Language
): GaleriaDeSonhosInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.GALERIA_DE_SONHOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: GALERIA_DE_SONHOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      language,
      gameOrder: [],
      tableDeck: [],
      wordsDeck: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // * -> WORD_SELECTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> DREAMS_SELECTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.DREAMS_SELECTION) {
    const newPhase = await prepareDreamsSelectionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // DREAMS_SELECTION -> CARD_PLAY
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> RESOLUTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles cards submissions
 * May trigger next phase
 */
export const submitAction = async (data: GaleriaDeSonhosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_WORD':
      firebaseUtils.validateSubmitActionProperties(data, ['wordId'], 'submit word');
      return handleSubmitWord(collectionName, gameId, playerId, data.wordId);
    case 'SUBMIT_CARDS':
      firebaseUtils.validateSubmitActionProperties(data, ['cardsIds'], 'submit cards');
      return handleSubmitCards(collectionName, gameId, playerId, data.cardsIds);
    case 'PLAY_CARD':
      firebaseUtils.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
