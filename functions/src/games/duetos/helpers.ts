// Types
import type { ItemData } from '../../types/tdr';
import type { FirebaseStoreData, Gallery, GalleryItem, ItemEntry } from './types';
// Constants
import { SEPARATOR } from '../../constants/general';
import { DUETOS_PHASES } from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, PAIRING, RESULTS, GAME_OVER } = DUETOS_PHASES;
  const order = [SETUP, PAIRING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : PAIRING;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Adds items from the pool to the receiver array
 * @param pool - The pool of available items
 * @param quantity - The number of items to add
 * @param receiver - The array to receive the items
 */
export const addItems = (pool: ItemData[], quantity: number, receiver: any[]) => {
  for (let i = 0; i < quantity; i++) {
    const item = pool.pop();
    if (item) {
      receiver.push({
        type: 'alien-item',
        id: `alien-item${SEPARATOR}${item.id}`,
        value: {
          id: item.id,
          name: item.name,
        },
      });
    }
  }
};

/**
 * Adds special elements from the pool to the receiver array
 * @param pool - The pool of available special elements
 * @param quantity - The number of elements to add
 * @param receiver - The array to receive the elements
 * @param type - The type of special element
 */
export const addSpecial = (pool: any[], quantity: number, receiver: any[], type: string) => {
  for (let i = 0; i < quantity; i++) {
    const element = pool.pop();
    if (element) {
      const id = `${type}${SEPARATOR}${element?.id ?? element}`;
      receiver.push({
        type,
        id,
        value: element,
      });
    }
  }
};

const PAIR_SEPARATOR = '+';

/**
 * Calculates results by scoring player pairs and determining rankings
 * @param players - The collection of players in the game
 * @param pool - The array of item entries in the pool
 * @param store - The Firebase store data for tracking achievements
 */
export const calculateResults = (players: Players, pool: ItemEntry[], store: FirebaseStoreData) => {
  const poolIds = pool.map((item) => item.id);

  const pairsByPlayers: Record<string, UID[]> = {};

  const extra: Record<string, UID[]> = {};

  getListOfPlayers(players, true).forEach((player) => {
    for (let i = 0; i < player.pairs.length; i += 2) {
      const pair = [player.pairs[i], player.pairs[i + 1]].sort().join(PAIR_SEPARATOR);

      if (pairsByPlayers[pair] === undefined) {
        pairsByPlayers[pair] = [];
      }
      pairsByPlayers[pair].push(player.id);
    }

    const playerParisSet = new Set(player.pairs);

    // Use filter to return elements that are in arr1 but not in arr2
    const difference = poolIds.filter((element) => !playerParisSet.has(element));
    if (difference[0] !== undefined) {
      if (extra[difference[0]] === undefined) {
        extra[difference[0]] = [];
      }
      extra[difference[0]].push(player.id);
    }
  });

  // Gained Points: [paris, left out]
  const scores = new Scores(players, [0, 0]);

  Object.values(pairsByPlayers).forEach((pairPlayers) => {
    const count = pairPlayers.length;
    scores.addMultiple(pairPlayers, count - 1, 0);

    // Achievements: Alone
    if (count === 1) {
      increaseAchievement(store.achievements, pairPlayers[0], 'alone', 1);
    }
    // Achievements: Duos
    if (count === 2) {
      increaseAchievement(store.achievements, pairPlayers[0], 'duos', 1);
      increaseAchievement(store.achievements, pairPlayers[1], 'duos', 1);
    }
    // Achievements: Group
    if (count > 2) {
      pairPlayers.forEach((playerId) => {
        increaseAchievement(store.achievements, playerId, 'groups', 1);
      });
    }
  });

  Object.values(extra).forEach((extraPlayers) => {
    const count = extraPlayers.length;
    scores.addMultiple(extraPlayers, count - 1, 1);

    // Achievements: Left out
    extraPlayers.forEach((playerId) => {
      increaseAchievement(store.achievements, playerId, 'leftOut', 1);
    });
  });

  const gallery: Gallery = Object.entries(pairsByPlayers)
    .map(([pair, players]) => {
      const [id1, id2] = pair.split(PAIR_SEPARATOR);
      const item1 = pool.find((item) => item.id === id1);
      const item2 = pool.find((item) => item.id === id2);

      const entry: GalleryItem = {
        pairId: pair,
        pair: [item1, item2],
        players,
      };
      return entry;
    })
    .sort((a, b) => {
      return a.players.length > b.players.length ? -1 : 1;
    });

  const leftOut = Object.entries(extra)
    .map(([id, players]) => {
      const item = pool.find((item) => item.id === id);
      return {
        id,
        item,
        players,
      };
    })
    .sort((a, b) => {
      return a.players.length > b.players.length ? -1 : 1;
    });

  return {
    ranking: scores.rank(players),
    gallery,
    leftOut,
  };
};
