import { random } from 'lodash';
// Types
import type { CategoryCard, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../constants/general';
import { CATEGORIES_PER_ROUND, MAX_ROUNDS, ONDA_TELEPATICA_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { saveData } from './data';
import { buildDeck, buildRanking } from './helpers';

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
  const { gameOrder, playerIds } = utils.turnOrder.create(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined,
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;
  // Build deck
  const deck = buildDeck(additionalData);

  // Setup achievements
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

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

/**
 * [Dial Clue Phase] - The psychic selects a category and dials a clue
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareDialCluePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const psychicId = utils.turnOrder.getActivePlayerId(store.gameOrder, state.round.current + 1);

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
        round: utils.game.increaseRound(state.round),
        players,
        psychicId,
        currentCategories,
        target: random(-10, 10),
      },
    },
  };
};

/**
 * [Guess Phase] - Players guess the psychic's target number
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
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

/**
 * [Reveal Phase] - Reveal target and calculate scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
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

/**
 * [Game Over Phase] - Finalize game and save results
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

  // Get achievements
  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

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
      storeCleanup: cleanupStore(store, []),
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
