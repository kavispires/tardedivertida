// Constants
import { CATEGORIES_PER_ROUND, MAX_ROUNDS, ONDA_TELEPATICA_PHASES } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Types
import type { CategoryCard, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { buildDeck, buildRanking, getAchievements } from './helpers';
import { saveData } from './data';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder, playerIds } = utils.players.buildGameOrder(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined,
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;
  // Build deck
  const deck = buildDeck(additionalData);

  // Setup achievements
  const achievements = utils.achievements.setup(players, store, {
    exact: 0,
    accuracy: 0,
    zero: 0,
    psychicPoints: 0,
  });

  // Save
  return {
    update: {
      store: {
        gameOrder,
        deck,
        deckIndex: 0,
        pastCategories: [],
        achievements,
      },
      state: {
        phase: ONDA_TELEPATICA_PHASES.SETUP,
        gameOrder: playerIds,
        round: {
          current: 0,
          total: totalRounds,
        },
      },
    },
  };
};

export const prepareDialCluePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const psychicId = utils.players.getActivePlayer(store.gameOrder, state.round.current + 1);

  utils.players.readyPlayers(players, psychicId);

  // Get categories
  const currentCategories = Array(CATEGORIES_PER_ROUND)
    .fill(store.deckIndex)
    .map((deckIndex, index) => store.deck[deckIndex + index]);

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + CATEGORIES_PER_ROUND,
      },
      state: {
        phase: ONDA_TELEPATICA_PHASES.DIAL_CLUE,
        round: utils.helpers.increaseRound(state.round),
        players,
        psychicId,
        currentCategories,
        target: utils.game.getRandomNumber(-10, 10),
      },
    },
  };
};

export const prepareGuessPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Modify player
  utils.players.addPropertiesToPlayers(players, {
    guess: 0,
  });

  const selectedCategory = store.deck.find(
    (category: CategoryCard) => category.id === state.currentCategoryId,
  );

  const currentCategory = {
    ...selectedCategory,
    target: state.target,
    clue: store.clue,
    psychicId: state.psychicId,
  };

  // Save
  return {
    update: {
      store: {
        pastCategories: [...store.pastCategories, currentCategory],
      },
      state: {
        phase: ONDA_TELEPATICA_PHASES.GUESS,
        players,
        currentCategory,
      },
      stateCleanup: ['currentCategories', 'currentCategoryId', 'target'],
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Gather votes
  const ranking = buildRanking(players, state.currentCategory, state.psychicId, store);

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: ONDA_TELEPATICA_PHASES.REVEAL,
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

  // Get achievements
  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ONDA_TELEPATICA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const pastCategories = store.pastCategories;

  await saveData(pastCategories);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ONDA_TELEPATICA_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        pastCategories,
        achievements,
      },
    },
  };
};
