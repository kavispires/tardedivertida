import { random } from 'lodash';
// Types
import type { CategoryCard, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../constants/general';
import { CATEGORIES_PER_ROUND, MAX_ROUNDS, ONDA_TELEPATICA_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  setPlayersReadyState,
  getListOfPlayersIds,
  addPropertiesToPlayers,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';
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
  const { gameOrder, playerIds } = turnOrderUtils.create(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined,
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;
  // Build deck
  const deck = buildDeck(additionalData);

  // Setup achievements
  const achievements = setupAchievements(getListOfPlayersIds(players));

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
  const psychicId = turnOrderUtils.getActivePlayerId(store.gameOrder, state.round.current + 1);

  setPlayersReadyState(players, true, { excludeIds: [psychicId] });

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
        round: increaseRound(state.round),
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
  setPlayersReadyState(players, false);

  // Modify player
  addPropertiesToPlayers(players, {
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

  setPlayersReadyState(players, false);

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
  const winners = determineWinners(players);

  // Get achievements
  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
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

  cleanupPlayers(players, []);

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
