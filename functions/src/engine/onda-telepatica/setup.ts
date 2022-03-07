// Constants
import { CATEGORIES_PER_ROUND, MAX_ROUNDS, ONDA_TELEPATICA_PHASES } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Types
import { CategoryCard, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
// Internal
import { buildDeck, buildRanking } from './helpers';

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
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder, playerIds } = utils.buildGameOrder(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;
  // Build deck
  const deck = buildDeck(additionalData);

  // Save
  return {
    update: {
      store: {
        gameOrder,
        deck,
        deckIndex: 0,
        pastCategories: [],
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
  players: Players
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const psychicId = utils.getActivePlayer(store.gameOrder, state.round.current + 1);

  utils.readyPlayers(players, psychicId);

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
        round: utils.increaseRound(state.round),
        psychicId,
        currentCategories,
        target: gameUtils.getRandomNumber(-10, 10),
      },
      players,
    },
  };
};

export const prepareGuessPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Modify player
  utils.addPropertiesToPlayers(players, {
    needle: 0,
  });

  const selectedCategory = store.deck.find(
    (category: CategoryCard) => category.id === state.currentCategoryId
  );

  const currentCategory = {
    ...selectedCategory,
    target: state.target,
    clue: store.clue,
  };

  // Save
  return {
    update: {
      store: {
        pastCategories: [...store.pastCategories, currentCategory],
      },
      state: {
        phase: ONDA_TELEPATICA_PHASES.GUESS,
        currentCategory,
        currentCategories: firebaseUtils.deleteValue(),
        currentCategoryId: firebaseUtils.deleteValue(),
        target: firebaseUtils.deleteValue(),
      },
      players,
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const ranking = buildRanking(players, state.currentCategory, state.psychicId);

  // Save
  return {
    update: {
      state: {
        phase: ONDA_TELEPATICA_PHASES.REVEAL,
        ranking,
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
        phase: ONDA_TELEPATICA_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
