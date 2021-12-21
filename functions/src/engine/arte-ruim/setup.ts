// Types
import { PlainObject, Players, SaveGamePayload } from '../../utils/types';
import { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { ARTE_RUIM_PHASES, MAX_ROUNDS } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
import { buildDeck, buildGallery, buildRanking, dealCards, getNewPastDrawings } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalData: PlainObject
): Promise<SaveGamePayload> => {
  // Get number of cards per level
  const playerCount = Object.keys(players).length;

  // Build deck
  const deck = buildDeck(
    additionalData.allCards,
    additionalData.level4Cards,
    additionalData.usedCardsId,
    playerCount
  );

  // Save
  return {
    update: {
      store: {
        deck,
        pastDrawings: [],
        currentCards: [],
      },
    },
  };
};

export const prepareDrawPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Remove previous 'vote' from players
  utils.removePropertiesFromPlayers(players, ['vote']);

  // Deal cards
  dealCards(players, store);

  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: ARTE_RUIM_PHASES.DRAW,
        round: utils.increaseRound(state?.round, MAX_ROUNDS),
        level: Object.values(players)?.[0]?.currentCard?.level ?? 0,
      },
    },
    set: {
      players,
    },
  };
};

export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Shuffle cards
  const shuffledCards = gameUtils.shuffle(store.currentCards);

  // Shuffle drawings
  const shuffledDrawings = gameUtils.shuffle(Object.values(players).map((player) => player.currentCard));

  return {
    update: {
      store: {
        // TODO: is this necessary?
        ...store,
      },
      state: {
        phase: ARTE_RUIM_PHASES.EVALUATION,
        cards: shuffledCards,
        drawings: shuffledDrawings,
      },
    },
    set: {
      players,
    },
  };
};

export const prepareGalleryPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Build gallery
  const gallery = buildGallery(state.drawings, players);

  const ranking = buildRanking(players, gallery);

  const pastDrawings = getNewPastDrawings(players, gallery);

  return {
    update: {
      store: {
        ...store,
        pastDrawings: [...store.pastDrawings, ...pastDrawings],
      },
    },
    set: {
      players,
      state: {
        phase: ARTE_RUIM_PHASES.GALLERY,
        round: state.round,
        gallery,
        cards: store.currentCards,
        ranking,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.determineWinners(players);

  const finalGallery = utils.orderBy(store.pastDrawings, 'successRate', 'desc');

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: ARTE_RUIM_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        drawings: finalGallery,
      },
    },
  };
};
