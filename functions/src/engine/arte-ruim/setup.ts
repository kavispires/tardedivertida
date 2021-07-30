// Interfaces
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
// Constants
import { ARTE_RUIM_PHASES, ARTE_RUIM_TOTAL_ROUNDS, CARDS_PER_PLAYER_COUNT } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
import {
  buildDeck,
  buildGallery,
  buildRanking,
  dealCards,
  filterAvailableCards,
  getNewPastDrawings,
} from './helpers';
// Other
import { FirebaseStateData, FirebaseStoreData } from './interfaces';

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
  const totalCardsNeeded = CARDS_PER_PLAYER_COUNT[playerCount].total;
  const perLevelNeeded = CARDS_PER_PLAYER_COUNT[playerCount].perLevel;

  // Filter used cards, if not enough cards, just use the full deck
  const filteredCards = filterAvailableCards(additionalData.allCards, additionalData.usedCards);
  const availableCards = filteredCards.length < totalCardsNeeded ? additionalData.allCards : filteredCards;

  // Build deck
  const deck = buildDeck(availableCards, perLevelNeeded);

  // Save
  return {
    update: {
      store: {
        deck,
        pastDrawings: [],
        currentCards: [],
      },
      state: {
        phase: ARTE_RUIM_PHASES.SETUP,
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
        updatedAt: Date.now(),
        round: {
          current: (state?.round?.current ?? 0) + 1,
          total: ARTE_RUIM_TOTAL_ROUNDS,
        },
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
        ...store,
      },
      state: {
        phase: ARTE_RUIM_PHASES.EVALUATION,
        updatedAt: Date.now(),
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
        updatedAt: Date.now(),
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
      store: {
        ...store,
      },
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: ARTE_RUIM_PHASES.GAME_OVER,
        winners,
        gameEndedAt: Date.now(),
        round: state.round,
        drawings: finalGallery,
      },
    },
  };
};
