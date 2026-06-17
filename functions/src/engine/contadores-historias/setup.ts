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
import { buildTable, buildTableDeck, getTableCards, scoreRound } from './helpers';
import { setupAchievements, getAchievements } from './achievements';
import { saveData } from './data';

/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param data - Resource data
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  data: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = utils.turnOrder.create(players);

  const { gameOrder: roundsIfRoundFixed } = utils.turnOrder.create(players, DOUBLE_ROUNDS_THRESHOLD);
  const totalRounds = store.options.fixedRounds ? roundsIfRoundFixed.length : MAX_ROUNDS;

  // Assigned cards to players
  // Get table deck removing them from the original list of cards
  const tableDeck = buildTableDeck(data.cards, 2 * CARDS_PER_PLAYER);

  // Split cards equally between players
  utils.playerHand.dealDeck(players, data.cards, CARDS_PER_PLAYER, 'deck');

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

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
 * Story phase - storyteller writes a story/prompt for their card
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareStoryPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Make sure everybody has the hand limit cards in hand
  utils.playerHand.dealPlayersCard(players, HAND_LIMIT);
  utils.players.removePropertiesFromPlayers(players, ['vote', 'cardId', 'story']);

  // Determine active player based on current round
  const storytellerId = utils.turnOrder.getActivePlayerId(state.gameOrder, state.round.current + 1);
  const nextStorytellerId = utils.turnOrder.getActivePlayerId(state.gameOrder, state.round.current + 2);

  utils.players.readyPlayers(players, storytellerId);

  // Save
  return {
    update: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.STORY,
        players,
        round: utils.game.increaseRound(state.round),
        storytellerId,
        nextStorytellerId,
      },
      stateCleanup: ['outcome', 'ranking', 'table', 'story'],
      storeCleanup: ['currentTableDictionary'],
    },
  };
};

/**
 * Card Play phase - players select cards to match the storyteller's story
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardPlayPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players to play cards
  utils.players.unReadyPlayers(players, state.storytellerId);

  const storyteller = players[state.storytellerId];

  // Add card solution as the storyteller's vote
  storyteller.vote = players[state.storytellerId].cardId;
  // Discard storyteller's card
  utils.playerHand.discardPlayerCard(players, storyteller.cardId, state.storytellerId, HAND_LIMIT);

  // Save
  return {
    update: {
      store: {
        solutionCardId: storyteller.cardId,
      },
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.CARD_PLAY,
        players,
        story: storyteller.story,
      },
    },
  };
};

/**
 * Voting phase - players vote on which card they think matches the story
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareVotingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const tableCardsCount = TABLE_CARDS_BY_PLAYER_COUNT[utils.players.getPlayerCount(players)];

  // Remove cards from player's hands and refill hands
  utils.players.getListOfPlayers(players, false, [state.storytellerId]).forEach((player) => {
    utils.playerHand.discardPlayerCard(players, player.cardId, player.id, HAND_LIMIT);
  });

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

/**
 * Resolution phase - reveals votes and calculates scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Gather votes
  const { ranking, outcome, table } = scoreRound(players, state.table, state.storytellerId, store);

  const { usedCards = [] } = store;
  usedCards.push({
    story: state.story,
    cardId: store.solutionCardId,
    language: store.language,
  });

  utils.players.unReadyPlayers(players);

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

/**
 * Game Over phase - determines winners and saves game data
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store.achievements);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CONTADORES_HISTORIAS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data: imageCards and clues
  await saveData(store.usedCards, store.language);
  const gallery = store.usedCards;

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CONTADORES_HISTORIAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        achievements,
        gallery,
      },
    },
  };
};
