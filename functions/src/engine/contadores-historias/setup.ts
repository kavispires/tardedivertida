// Constants
import {
  CARDS_PER_PLAYER,
  CONTADORES_HISTORIAS_PHASES,
  HAND_LIMIT,
  MAX_ROUNDS,
  TABLE_CARDS_BY_PLAYER_COUNT,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
import type { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal
import { buildTable, buildTableDeck, getTableCards, scoreRound } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerCount } = utils.helpers.buildGameOrder(players);

  const { gameOrder: roundsIfRoundFixed } = utils.helpers.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);
  const totalRounds = store.options.fixedRounds ? roundsIfRoundFixed.length : MAX_ROUNDS;

  // Assigned cards to players
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  // Also add 1 deck (with the double amount of cards) to be used as the table deck
  const minimumNumberOfCards = (playerCount + 2) * CARDS_PER_PLAYER;
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards);

  // Get table deck removing them from the original list of cards
  const tableDeck = buildTableDeck(cards, 2 * CARDS_PER_PLAYER);

  // Split cards equally between players
  players = utils.game.dealList(cards, players, CARDS_PER_PLAYER, 'deck');

  // Save
  return {
    update: {
      store: {
        usedCards: [],
        tableDeck,
        tableDeckIndex: -1,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.SETUP,
        gameOrder,
        round: {
          current: 0,
          total: totalRounds,
        },
      },
      players,
    },
  };
};

/**
 * Prepares Write Story Phase where players get their hand of cards, and a storyteller must write a story/prompt
 * @param store
 * @param state
 * @param players
 * @returns
 */
export const prepareStoryPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Make sure everybody has 6 cards in hand
  players = utils.playerHand.dealPlayersCard(players, HAND_LIMIT);
  players = utils.players.removePropertiesFromPlayers(players, ['vote', 'cardId']);

  // Determine active player based on current round
  const storytellerId = utils.players.getActivePlayer(state.gameOrder, state.round.current + 1);
  const nextStorytellerId = utils.players.getActivePlayer(state.gameOrder, state.round.current + 2);

  // Save
  return {
    update: {
      store: {
        currentTableDictionary: utils.firebase.deleteValue(),
        story: utils.firebase.deleteValue(),
        solutionCardId: utils.firebase.deleteValue(),
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.STORY,
        round: utils.helpers.increaseRound(state.round),
        storytellerId,
        nextStorytellerId,
        outcome: utils.firebase.deleteValue(),
        ranking: utils.firebase.deleteValue(),
        table: utils.firebase.deleteValue(),
        story: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players to play cards
  utils.players.unReadyPlayers(players, state.storytellerId);

  // Add card solution to storyteller
  players[state.storytellerId].cardId = store.solutionCardId;
  players[state.storytellerId].vote = store.solutionCardId;

  // Save
  return {
    update: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.CARD_PLAY,
        story: store.story,
      },
      players,
    },
  };
};

export const prepareVotingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const tableCardsCount = TABLE_CARDS_BY_PLAYER_COUNT[Object.keys(players).length];

  // Get N cards from tableDeck
  const tableCards = getTableCards(store.tableDeck, store.tableDeckIndex, tableCardsCount);

  const table = buildTable(players, tableCards, state.storytellerId);

  // Unready players to vote
  utils.players.unReadyPlayers(players, state.storytellerId);

  // Save
  return {
    update: {
      store: {
        tableDeckIndex: store.tableDeckIndex + tableCardsCount,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.VOTING,
        table,
      },
      players,
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const { ranking, outcome, table } = scoreRound(players, state.table, state.storytellerId);

  // Save
  return {
    update: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.RESOLUTION,
        outcome,
        ranking,
        table,
      },
      players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
