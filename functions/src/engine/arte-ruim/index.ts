// Constants
import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT } from '../../utils/constants';
import { ARTE_RUIM_PHASES, ARTE_RUIM_TOTAL_ROUNDS } from './constants';
// Interfaces
import { GameId, Players } from '../../utils/interfaces';
import { ArteRuimInitialState } from './interfaces';
// Utilities
import * as firebaseUtils from '../../utils/firebase';
import { buildPastDrawingsDict, buildUsedCardsIdsDict, determineNextPhase } from './helpers';
// Internal Functions
import {
  prepareSetupPhase,
  prepareDrawPhase,
  prepareEvaluationPhase,
  prepareGalleryPhase,
  prepareGameOverPhase,
} from './setup';
import * as arteRuimActions from './actions';
// Data
import arteRuimCardsPt from '../../resources/arte-ruim-pt.json';
import arteRuimCardsEn from '../../resources/arte-ruim-en.json';
import * as globalUtils from '../global';
import * as publicUtils from '../public';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (gameId: GameId, uid: string, language: string): ArteRuimInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.ARTE_RUIM,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.ARTE_RUIM.min,
    max: GAME_PLAYERS_LIMIT.ARTE_RUIM.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    language,
    deck: [],
    usedCards: [],
    currentCards: [],
    pastDrawings: [],
  },
  state: {
    phase: ARTE_RUIM_PHASES.LOBBY,
    round: {
      current: 0,
      total: ARTE_RUIM_TOTAL_ROUNDS,
    },
    updatedAt: Date.now(),
  },
});

export const nextArteRuimPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Determine and prepare next phase
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = storeDoc.data() ?? {};

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round ?? 0);

  // RULES -> SETUP
  if (nextPhase === ARTE_RUIM_PHASES.SETUP) {
    // Request data
    const additionalData = await getCards(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return nextArteRuimPhase(collectionName, gameId, players);
  }

  // SETUP -> DRAW
  if (nextPhase === ARTE_RUIM_PHASES.DRAW) {
    const newPhase = await prepareDrawPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // DRAW -> EVALUATION
  if (nextPhase === ARTE_RUIM_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === ARTE_RUIM_PHASES.GALLERY) {
    const newPhase = await prepareGalleryPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  if (nextPhase === ARTE_RUIM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);

    // Save usedArteRuimCards to global
    const usedArteRuimCards = buildUsedCardsIdsDict(store.pastDrawings);
    await globalUtils.updateGlobalFirebaseDoc('usedArteRuimCards', usedArteRuimCards);
    // Save drawings to public gallery
    const publicDrawings = await publicUtils.getPublicFirebaseDocData('arteRuimDrawings', {});
    const newArteRuimDrawings = buildPastDrawingsDict(store.pastDrawings, publicDrawings);
    await publicUtils.updatePublicFirebaseDoc('arteRuimDrawings', newArteRuimDrawings);

    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

export const submitDrawing = arteRuimActions.submitDrawing;
export const submitVoting = arteRuimActions.submitVoting;

const getCards = async (language: string) => {
  // Get full deck
  const allCards = language === 'en' ? arteRuimCardsEn : arteRuimCardsPt;
  // Get used deck
  // const usedCards = (await firebaseUtils.getGlobalRef().doc('usedArteRuimCards')?.get())?.data() ?? {};
  const usedCards = globalUtils.getGlobalFirebaseDocData('usedArteRuimCards', {});
  return {
    allCards,
    usedCards: Object.keys(usedCards),
  };
};
