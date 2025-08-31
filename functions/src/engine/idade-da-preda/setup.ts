// Utils
import { keyBy, orderBy } from 'lodash';
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import {
  BASIC_CONCEPTS,
  CONCEPTS_FOR_FIRST_ROUND,
  CONCEPTS_FOR_NEW_AGES,
  IDADE_DA_PREDA_PHASES,
  ITEMS_PER_PLAYER_PER_AGE,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
import type { Concept, FirebaseStateData, FirebaseStoreData, NewNameEntry, ResourceData } from './types';
import { buildGalleryAndRanking, gatherConcepts } from './helpers';
import type { Item } from '../../types/tdr';

/**
 * Setup
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Build table and distribute cards to players
  const items = utils.game.shuffle([...additionalData['0']]);

  const achievements = utils.achievements.setup(players, {
    concepts: 0,
    conceptItems: 0,
    nameLength: 0,
    nameQuality: 0,
    distinctNames: 0,
    commonKnowledge: 0,
  });

  // Save
  return {
    update: {
      store: {
        achievements,
        items: additionalData,
        gallery: [],
        pool: [],
      },
      state: {
        phase: IDADE_DA_PREDA_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
        items: keyBy(items, 'id'),
        basicConcepts: [],
        concepts: [],
      },
    },
  };
};

/**
 * Prepares the game for the Creating Concepts phase.
 */
export const prepareCreatingConceptsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);
  // Unready players
  utils.players.unReadyPlayers(players);

  // Determine how many concepts each player may create
  const totalProposals = round.current === 1 ? CONCEPTS_FOR_FIRST_ROUND : CONCEPTS_FOR_NEW_AGES;

  const maxProposals = Math.max(Math.ceil(totalProposals / utils.players.getPlayerCount(players)), 1);

  const roundsItems = utils.game.shuffle([...store.items[round.current]]);

  const playersCount = utils.players.getPlayerCount(players);

  // Deal hands
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.hand = utils.game.dealItems(roundsItems, ITEMS_PER_PLAYER_PER_AGE);
  });

  // Pool items for the round
  const pool = utils.game.dealItems(
    roundsItems,
    (PLAYER_COUNTS.MAX - playersCount) * ITEMS_PER_PLAYER_PER_AGE,
  );

  // Add new items
  const items: Dictionary<Item> = { ...(state.items ?? {}), ...keyBy(roundsItems, 'id') };

  return {
    update: {
      state: {
        phase: IDADE_DA_PREDA_PHASES.CREATING_CONCEPTS,
        players,
        round,
        maxProposals,
        items,
        pool,
      },
    },
  };
};

/**
 * Prepares the game for the Reveal Concepts phase.
 */
export const prepareConceptsRevealPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const concepts = gatherConcepts(players, store);

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: IDADE_DA_PREDA_PHASES.CONCEPTS_REVEAL,
        players,
        basicConcepts: BASIC_CONCEPTS,
        concepts: orderBy(concepts, ['age', 'key'], ['desc', 'asc']),
      },
    },
  };
};

/**
 * Prepares the game for the Reveal Concepts phase.
 */
export const prepareCommunicatingThingsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const concepts: Concept[] = state.concepts;

  const pool: Item[] = state.pool;

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.hand) {
      pool.push(...player.hand);
    }
  });

  return {
    update: {
      state: {
        phase: IDADE_DA_PREDA_PHASES.COMMUNICATING_THINGS,
        players,
        concepts: orderBy(concepts, [`syllable.${store.language}`, 'key'], ['asc', 'asc']),
        pool: utils.game.shuffle(pool),
      },
    },
  };
};

/**
 * Prepares the game for the Reveal Concepts phase.
 */
export const prepareGuessingPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const newNames: NewNameEntry[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.proposedName) {
      const { itemId, name, conceptsIds } = player.proposedName;
      newNames.push({
        playerId: player.id,
        name,
        itemId,
        id: `${player.id}-${itemId}`,
        conceptsIds,
      });
    }
  });

  return {
    update: {
      state: {
        phase: IDADE_DA_PREDA_PHASES.GUESSING,
        players,
        newNames: orderBy(newNames, ['name'], ['asc']),
      },
    },
  };
};

/**
 * Prepares the game for the Reveal Concepts phase.
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // 2 points for guessing correctly, 1 point for getting your name guessed

  // Save to gallery
  const { gallery, ranking } = buildGalleryAndRanking(state.newNames, players, store);

  return {
    update: {
      store: {
        gallery: [...store.gallery, ...gallery],
        achievements: store.achievements,
      },
      state: {
        phase: IDADE_DA_PREDA_PHASES.RESULTS,
        players,
        gallery,
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

  // const achievements = getAchievements(store);
  const achievements = [];

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.IDADE_DA_PREDA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: IDADE_DA_PREDA_PHASES.GAME_OVER,
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
