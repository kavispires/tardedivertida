// Constants
import {
  CARDS_PER_PLAYER,
  CONTADORES_HISTORIAS_PHASES,
  HAND_LIMIT,
  MAX_ROUNDS,
  TABLE_CARDS_BY_PLAYER_COUNT,
} from './constants';
// Interfaces
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
import { Players, SaveGamePayload } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import * as imageCards from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
import * as playerHandUtils from '../../utils/player-hand-utils';
import { buildTable, buildTableDeck, getTableCards, scoreRound } from './helpers';

// prepareSetupPhase
// prepareWriteStoryPhase
// preparePlayCardPhase
// prepareVotingPhase
// prepareResolutionPhase
// prepareGameOverPhase

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
  const gameOrder = gameUtils.shuffle(Object.keys(players));

  // Assigned cards to players
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  // Also add 1 deck (with the double amount of cards) to be used as the table deck
  const minNumCards = (gameOrder.length + 2) * CARDS_PER_PLAYER;
  const numDecks = Math.ceil(minNumCards / imageCards.IMAGE_CARDS_PER_DECK);
  const cards = gameUtils.shuffle(imageCards.getImageCards(numDecks));

  // Get table deck removing them from the original list of cards
  const tableDeck = buildTableDeck(cards, 2 * CARDS_PER_PLAYER);

  // Split cards equally between players
  players = gameUtils.dealList(cards, players, CARDS_PER_PLAYER, 'deck');

  // Save
  return {
    update: {
      store: {
        gameOrder,
        usedCards: [],
        tableDeck,
        tableDeckIndex: -1,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
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
  const storyteller = utils.getActivePlayer(store.gameOrder, state.round.current + 1);
  const nextStoryteller = utils.getActivePlayer(store.gameOrder, state.round.current + 2);

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
        updatedAt: Date.now(),
        round: utils.increaseRound(state.round),
        storyteller,
        nextStoryteller,
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
  utils.unReadyPlayers(players, state.storyteller);

  // Add card solution to storyteller
  players[state.storyteller].cardId = store.solutionCardId;
  players[state.storyteller].vote = store.solutionCardId;

  // Save
  return {
    update: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.CARD_PLAY,
        updatedAt: Date.now(),
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

  const table = buildTable(players, tableCards, state.storyteller);

  // Unready players to vote
  utils.unReadyPlayers(players, state.storyteller);

  // Save
  return {
    update: {
      store: {
        tableDeckIndex: store.tableDeckIndex + tableCardsCount,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.VOTING,
        updatedAt: Date.now(),
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
  const { ranking, outcome, table } = scoreRound(players, state.table, state.storyteller);

  // Save
  return {
    update: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.RESOLUTION,
        updatedAt: Date.now(),
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
        winners,
        gameEndedAt: Date.now(),
        round: state.round,
      },
    },
  };
};
