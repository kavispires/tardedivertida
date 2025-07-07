// Types
import type { TextCard } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { CARDS_PER_PLAYER, TREVO_DA_SORTE_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Helpers
import utils from '../../utils';
// Internal
import { buildClovers, buildGuesses, buildLeaves, buildRanking } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  allWords: TextCard[],
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder, playerCount } = utils.players.buildGameOrder(players);

  const deck = utils.game.getRandomItems(allWords, playerCount * CARDS_PER_PLAYER);

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
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);
  // Deal cards to players
  utils.playerHand.dealDeck(players, store.deck, CARDS_PER_PLAYER, 'hand');

  // Save
  return {
    update: {
      state: {
        phase: TREVO_DA_SORTE_PHASES.WORD_SELECTION,
        players,
      },
    },
  };
};

export const prepareCloverWritingPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
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
      state: {
        phase: TREVO_DA_SORTE_PHASES.CLOVER_WRITING,
        players,
      },
    },
  };
};

export const prepareCloverGuessingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
      state: {
        phase: TREVO_DA_SORTE_PHASES.CLOVER_GUESSING,
        players,
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
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players);

  // Calculate score
  const ranking = buildRanking(players, state.activeCloverId);

  // Save
  return {
    update: {
      state: {
        phase: TREVO_DA_SORTE_PHASES.RESULTS,
        players,
        ranking,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TREVO_DA_SORTE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  // Save
  return {
    set: {
      state: {
        phase: TREVO_DA_SORTE_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
