import { orderBy, shuffle } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, GalleryItem, ItemEntry, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { CARDS_PER_HARD_ROUND, CARDS_PER_NORMAL_ROUND, DUETOS_PHASES, TOTAL_ROUNDS } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  getListOfPlayersIds,
  setPlayersReadyState,
  removePropertiesFromPlayers,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { savedData } from './data';
import { addItems, addSpecial, calculateResults } from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  /**
   * Build rounds
   * 2 normal with 8 cards each
   * 2 hard with 9 cards each
   * 1 final with 12 cards mixing 3 of each previous type
   */
  const round1: unknown[] = [];
  const round2: unknown[] = [];
  const round3: unknown[] = [];
  const round4: unknown[] = [];

  const { items, decks } = resourceData;

  // Round 1 is always items
  addItems(items, CARDS_PER_NORMAL_ROUND, round1);

  // Round 2 is special or alien items
  if (decks[0]) {
    addSpecial(resourceData[decks[0]], CARDS_PER_NORMAL_ROUND, round2, decks[0]);
  } else {
    addItems(items, CARDS_PER_NORMAL_ROUND, round2);
  }

  // Round 3 is special if there are 3 special rounds, otherwise use this on round 4
  if (decks.length < 3 || decks.length === 2) {
    addItems(items, CARDS_PER_HARD_ROUND, round3);
  } else {
    addSpecial(resourceData[decks[1]], CARDS_PER_HARD_ROUND, round3, decks[1]);
  }

  // Round 4
  if (decks.length < 2) {
    addItems(items, CARDS_PER_HARD_ROUND, round4);
  } else {
    const index = decks.length - 1;
    addSpecial(resourceData[decks[index]], CARDS_PER_HARD_ROUND, round4, decks[index]);
  }

  const achievements = setupAchievements(getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        deck: {
          1: round1,
          2: round2,
          3: round3,
          4: round4,
          5: [{ type: 'mixed' }],
        },
        achievements,
        gallery: [],
      },
      state: {
        phase: DUETOS_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
    },
  };
};

/**
 * Pair phase - players create pairs from their cards
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePairPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false);
  removePropertiesFromPlayers(players, ['pairs']);

  const round = increaseRound(state.round);

  let pool = store.deck[round.current];
  const roundType = pool[0].type;

  if (round.current === 5) {
    // For each of the 4 previous rounds, sort the items by lowest pair score and take 3 of them.
    const itemsDict: Record<string, ItemEntry> = {};
    const singleEntriesScore: Record<string, Record<string, number>> = {};
    store.gallery.forEach((entry) => {
      const score = entry.players.length > 1 ? entry.players.length : 0;
      entry.pair.forEach((item) => {
        if (item) {
          itemsDict[item.id] = item;
          singleEntriesScore[entry.round] = singleEntriesScore[entry.round] || {};
          singleEntriesScore[entry.round][item.id] = (singleEntriesScore[entry.round][item.id] || 0) + score;
        }
      });
    });

    // For each round in singleEntriesScore, sort the items by score and take the 3 lowest scoring items
    const finalPool: ItemEntry[] = [];
    Object.keys(singleEntriesScore).forEach((round) => {
      const sortedItems = Object.entries(singleEntriesScore[round])
        .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
        .slice(0, 3)
        .map(([itemId]) => itemsDict[itemId]);
      finalPool.push(...sortedItems);
    });

    // Shuffle the final pool
    pool = shuffle(finalPool);
  }

  return {
    update: {
      state: {
        phase: DUETOS_PHASES.PAIRING,
        round,
        players,
        pool,
        roundType,
      },
      stateCleanup: ['gallery', 'ranking'],
    },
  };
};

/**
 * Results phase - calculates scores based on matching pairs
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const { ranking, gallery, leftOut } = calculateResults(players, state.pool, state.round.current, store);

  setPlayersReadyState(players, false);

  return {
    update: {
      store: {
        achievements: store.achievements,
        gallery: [...store.gallery, ...gallery],
      },
      state: {
        phase: DUETOS_PHASES.RESULTS,
        players,
        ranking,
        gallery,
        leftOut,
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
  const winners = determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
    gameName: GAME_NAMES.DUETOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = orderBy(
    store.gallery.filter((item: GalleryItem) => item.players.length > 2 && item.pair.every(Boolean)),
    'players.length',
    'desc',
  );

  // Save data (pairs)
  await savedData(gallery ?? []);

  cleanupPlayers(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: DUETOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
      },
    },
  };
};
