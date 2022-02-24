// Constants
import {
  CARDS_PER_PLAYER,
  CONTADORES_HISTORIAS_PHASES,
  HAND_LIMIT,
  MAX_ROUNDS,
  TABLE_CARDS_BY_PLAYER_COUNT,
} from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import * as imageCardsUtils from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
import * as playerHandUtils from '../../utils/player-hand-utils';
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
  const { gameOrder, playerCount } = utils.buildGameOrder(players);

  const { gameOrder: roundsIfRoundFixed } = utils.buildGameOrder(players, 7);
  const totalRounds = store.options.fixedRounds ? MAX_ROUNDS : roundsIfRoundFixed.length;

  // Assigned cards to players
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  // Also add 1 deck (with the double amount of cards) to be used as the table deck
  const minimumNumberOfCards = (playerCount + 2) * CARDS_PER_PLAYER;
  const cards = await imageCardsUtils.getImageCards(minimumNumberOfCards);

  // Get table deck removing them from the original list of cards
  const tableDeck = buildTableDeck(cards, 2 * CARDS_PER_PLAYER);

  // Split cards equally between players
  players = gameUtils.dealList(cards, players, CARDS_PER_PLAYER, 'deck');

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
  players = playerHandUtils.dealPlayersCard(players, HAND_LIMIT);
  players = utils.removePropertiesFromPlayers(players, ['vote', 'cardId']);

  // Determine active player based on current round
  const storytellerId = utils.getActivePlayer(state.gameOrder, state.round.current + 1);
  const nextStorytellerId = utils.getActivePlayer(state.gameOrder, state.round.current + 2);

  // Save
  return {
    update: {
      store: {
        currentTableDictionary: firebaseUtils.deleteValue(),
        story: firebaseUtils.deleteValue(),
        solutionCardId: firebaseUtils.deleteValue(),
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.STORY,
        round: utils.increaseRound(state.round),
        storytellerId,
        nextStorytellerId,
        outcome: firebaseUtils.deleteValue(),
        ranking: firebaseUtils.deleteValue(),
        table: firebaseUtils.deleteValue(),
        story: firebaseUtils.deleteValue(),
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
  utils.unReadyPlayers(players, state.storytellerId);

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
  utils.unReadyPlayers(players, state.storytellerId);

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
  const winners = utils.determineWinners(players);

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
