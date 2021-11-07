// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { MAX_ROUNDS, ONDA_TELEPATICA_PHASES, PLAYER_COUNT } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import { OndaTelepaticaInitialState, OndaTelepaticaSubmitAction } from './interfaces';
import {
  prepareDialCluePhase,
  prepareDialSidesPhase,
  prepareGameOverPhase,
  prepareGuessPhase,
  prepareRevealPhase,
  prepareSetupPhase,
} from './setup';
import { getCategories } from './data';
import { handleSubmitCategory, handleSubmitClue, handleSubmitGuess } from './actions';

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
): OndaTelepaticaInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.ONDA_TELEPATICA,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: ONDA_TELEPATICA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
      gameOrder: [],
      deck: [],
      deckIndex: -1,
    },
  });
};

export const nextOndaTelepaticaPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine if it's game over
  const isGameOver = determineGameOver(players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // RULES -> SETUP
  if (nextPhase === ONDA_TELEPATICA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getCategories(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return nextOndaTelepaticaPhase(collectionName, gameId, players);
  }

  // SETUP/REVEAL -> DIAL_SIDES
  if (nextPhase === ONDA_TELEPATICA_PHASES.DIAL_SIDES) {
    const newPhase = await prepareDialSidesPhase(store, state);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // DIAL_SIDES -> DIAL_CLUE
  if (nextPhase === ONDA_TELEPATICA_PHASES.DIAL_CLUE) {
    const newPhase = await prepareDialCluePhase(store);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // DIAL_CLUE -> GUESS
  if (nextPhase === ONDA_TELEPATICA_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESS -> REVEAL
  if (nextPhase === ONDA_TELEPATICA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === ONDA_TELEPATICA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles categories and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: OndaTelepaticaSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_CATEGORY':
      firebaseUtils.validateSubmitActionProperties(data, ['categoryId'], 'submit category');
      return handleSubmitCategory(collectionName, gameId, playerId, data.categoryId);
    case 'SUBMIT_CLUE':
      firebaseUtils.validateSubmitActionProperties(data, ['clue'], 'submit clue');
      return handleSubmitClue(collectionName, gameId, playerId, data.clue);
    case 'SUBMIT_GUESS':
      firebaseUtils.validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitGuess(collectionName, gameId, playerId, data.guess);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
