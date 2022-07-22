// Types
import type { ResourceData, FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { ARTE_RUIM_PHASES, REGULAR_GAME_LEVELS, SHORT_GAME_LEVELS } from './constants';
// Helpers
import * as utils from '../../utils';
import {
  buildDeck,
  buildGallery,
  buildRanking,
  dealCards,
  getNewPastDrawings,
  getTheTwoLevel5Cards,
} from './helpers';

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
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Get number of cards per level
  const playerCount = Object.keys(players).length;

  // Build deck
  const deck = buildDeck(resourceData, playerCount, store.options?.shortGame ?? false);

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
  utils.players.unReadyPlayers(players);

  // Remove previous 'votes' from players
  utils.players.removePropertiesFromPlayers(players, ['votes']);

  // Deal cards
  dealCards(players, store);

  // Update rounds
  const maxRounds = store.options?.shortGame ? SHORT_GAME_LEVELS.length : REGULAR_GAME_LEVELS.length;

  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: ARTE_RUIM_PHASES.DRAW,
        round: utils.helpers.increaseRound(state?.round, maxRounds),
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
  utils.players.unReadyPlayers(players);

  const level = store.currentCards?.[0]?.level ?? 1;

  // Shuffle cards
  const shuffledCards: ArteRuimCard[] =
    level === 5 ? getTheTwoLevel5Cards(store.currentCards) : utils.game.shuffle(store.currentCards);

  // Shuffle drawings
  const shuffledDrawings = utils.game.shuffle(Object.values(players).map((player) => player.currentCard));

  return {
    update: {
      // store: {
      //   // TODO: is this necessary?
      //   ...store,
      // },
      state: {
        phase: ARTE_RUIM_PHASES.EVALUATION,
        cards: shuffledCards,
        drawings: shuffledDrawings,
        level,
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
  utils.players.unReadyPlayers(players);

  // Build gallery
  const gallery = utils.game.shuffle(buildGallery(state.drawings, players));

  const ranking = buildRanking(state.drawings, players);

  const pastDrawings = getNewPastDrawings(players, gallery);

  return {
    update: {
      store: {
        ...store,
        pastDrawings: [...store.pastDrawings, ...pastDrawings],
      },
      players,
      state: {
        phase: ARTE_RUIM_PHASES.GALLERY,
        round: state.round,
        gallery,
        cards: store.currentCards,
        ranking,
        drawings: utils.firebase.deleteValue(),
      },
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const finalGallery = utils.helpers.orderBy(store.pastDrawings, 'successRate', 'desc');

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
