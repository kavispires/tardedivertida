// Types
import type { FirebaseStateData, FirebaseStoreData, AllWords } from './types';
// Constants
import { CARDS_PER_PLAYER, TREVO_DA_SORTE_PHASES } from './constants';

// Helpers
import * as utils from '../../utils';
import { buildClovers, buildGuesses, buildLeaves, buildRanking } from './helpers';
// Internal

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
  allWords: AllWords
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder, playerCount } = utils.helpers.buildGameOrder(players);

  const deck = utils.game.getRandomItems(Object.values(allWords), playerCount * CARDS_PER_PLAYER);

  // Save
  return {
    update: {
      store: {
        deck,
      },
      state: {
        phase: TREVO_DA_SORTE_PHASES.SETUP,
        round: {
          current: 1,
          total: 1,
        },
        gameOrder,
      },
    },
  };
};

export const prepareWordSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);
  // Deal cards to players
  utils.game.dealList(store.deck, players, CARDS_PER_PLAYER, 'hand');

  // Save
  return {
    update: {
      players,
      state: {
        phase: TREVO_DA_SORTE_PHASES.WORD_SELECTION,
      },
    },
  };
};

export const prepareCloverWritingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Build leaves for each player
  buildLeaves(players, store?.options?.hardGame ? 'hard' : 'normal');

  // Build clovers to players
  buildClovers(players);

  utils.players.removePropertiesFromPlayers(players, ['hand', 'badWordsIds']);

  // Save
  return {
    update: {
      players,
      state: {
        phase: TREVO_DA_SORTE_PHASES.CLOVER_WRITING,
      },
    },
  };
};

export const prepareCloverGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const gameOrder = state?.gameOrder ?? [];

  const activeCloverId = state.activeCloverId
    ? utils.players.getNextPlayer(gameOrder, state.activeCloverId)
    : gameOrder[0];

  utils.players.unReadyPlayers(players, activeCloverId);

  if (players[activeCloverId].guesses === undefined) {
    buildGuesses(players);
  }

  // TODO: Save clues to store

  // Save
  return {
    update: {
      players,
      state: {
        phase: TREVO_DA_SORTE_PHASES.CLOVER_GUESSING,
        activeCloverId,
        clover: players[activeCloverId].clover,
        leaves: players[activeCloverId].leaves,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players);

  // Calculate score
  const ranking = buildRanking(players);

  // Save
  return {
    update: {
      players,
      state: {
        phase: TREVO_DA_SORTE_PHASES.RESULTS,
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
  utils.players.readyPlayers(players);

  // Save
  return {
    update: {
      players,
      meta: {
        isComplete: true,
      },
    },
    set: {
      state: {
        phase: TREVO_DA_SORTE_PHASES.GAME_OVER,
        gameEndedAt: Date.now(),
      },
    },
  };
};
