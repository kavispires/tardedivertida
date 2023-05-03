// Constants
import {
  CARDS_PER_PLAYER,
  CONTADORES_HISTORIAS_PHASES,
  HAND_LIMIT,
  MAX_ROUNDS,
  TABLE_CARDS_BY_PLAYER_COUNT,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Type
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { buildTable, buildTableDeck, getAchievements, getTableCards, scoreRound } from './helpers';

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
  data: ResourceData
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = utils.players.buildGameOrder(players);

  const { gameOrder: roundsIfRoundFixed } = utils.players.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);
  const totalRounds = store.options.fixedRounds ? roundsIfRoundFixed.length : MAX_ROUNDS;

  // Assigned cards to players
  // Get table deck removing them from the original list of cards
  const tableDeck = buildTableDeck(data.cards, 2 * CARDS_PER_PLAYER);

  // Split cards equally between players
  players = utils.game.dealList(data.cards, players, CARDS_PER_PLAYER, 'deck');

  const achievements = utils.achievements.setup(players, store, {
    playerVotes: 0,
    badClues: 0,
    easyClues: 0,
    tableVotes: 0,
  });

  // Save
  return {
    update: {
      store: {
        usedCards: [],
        tableDeck,
        tableDeckIndex: -1,
        achievements,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.SETUP,
        gameOrder,
        round: {
          current: 0,
          total: totalRounds,
        },
        players,
      },
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

  utils.players.unReadyPlayer(players, storytellerId);

  // Save
  return {
    update: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.STORY,
        players,
        round: utils.helpers.increaseRound(state.round),
        storytellerId,
        nextStorytellerId,
      },
      stateCleanup: ['outcome', 'ranking', 'table', 'story'],
      storeCleanup: ['currentTableDictionary', 'story', 'solutionCardId'],
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
        players,
        story: store.story,
      },
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
        players,
        table,
      },
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const { ranking, outcome, table } = scoreRound(players, state.table, state.storytellerId, store);

  const { usedCards = [] } = store;
  usedCards.push({
    story: store.story,
    cardId: store.solutionCardId,
    language: store.language,
  });

  // Save
  return {
    update: {
      store: {
        usedCards: store.usedCards,
        achievements: store.achievements,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.RESOLUTION,
        outcome,
        ranking,
        table,
        players,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CONTADORES_HISTORIAS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  return {
    set: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        achievements,
      },
    },
  };
};
