// Types
import { AlienItem } from '../../types/tdr';
// Constants
import { SEPARATOR } from '../../utils/constants';
import { DUETOS_ACHIEVEMENTS, DUETOS_PHASES } from './constants';
import { DuetosAchievement, FirebaseStoreData, ItemEntry } from './types';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, PAIRING, RESULTS, GAME_OVER } = DUETOS_PHASES;
  const order = [RULES, SETUP, PAIRING, RESULTS];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : PAIRING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return PAIRING;
};

export const addAlienItems = (pool: AlienItem[], quantity: number, receiver: any[]) => {
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

export const calculateResults = (players: Players, pool: ItemEntry[], store: FirebaseStoreData) => {
  const poolIds = pool.map((item) => item.id);

  const pairsByPlayers: Record<string, PlayerId[]> = {};

  const extra: Record<string, PlayerId[]> = {};

  utils.players.getListOfPlayers(players, true).forEach((player) => {
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
  const scores = new utils.players.Scores(players, [0, 0]);

  Object.values(pairsByPlayers).forEach((pairPlayers) => {
    const count = pairPlayers.length;
    scores.addMultiple(pairPlayers, count, 0);

    // Achievements: Alone
    if (count === 1) {
      utils.achievements.increase(store, pairPlayers[0], 'alone', 1);
    }
    // Achievements: Duos
    if (count === 2) {
      utils.achievements.increase(store, pairPlayers[0], 'duos', 1);
      utils.achievements.increase(store, pairPlayers[1], 'duos', 1);
    }
    // Achievements: Group
    if (count > 2) {
      pairPlayers.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'groups', 1);
      });
    }
  });

  Object.values(extra).forEach((extraPlayers) => {
    const count = extraPlayers.length;
    scores.addMultiple(extraPlayers, count, 1);

    // Achievements: Left out
    extraPlayers.forEach((playerId) => {
      utils.achievements.increase(store, playerId, 'leftOut', 1);
    });
  });

  const gallery = Object.entries(pairsByPlayers)
    .map(([pair, players]) => {
      const [id1, id2] = pair.split(PAIR_SEPARATOR);
      const item1 = pool.find((item) => item.id === id1);
      const item2 = pool.find((item) => item.id === id2);
      return {
        pairId: pair,
        pair: [item1, item2],
        players,
      };
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<DuetosAchievement>[] = [];

  // Most alone: didn't have any matches the most
  const { most: mostAlone } = utils.achievements.getMostAndLeastOf(store, 'alone');
  if (mostAlone) {
    achievements.push({
      type: DUETOS_ACHIEVEMENTS.MOST_ALONE,
      playerId: mostAlone.playerId,
      value: mostAlone.value,
    });
  }

  // Most duos: had a pair with only one other person
  const { most: mostDuos } = utils.achievements.getMostAndLeastOf(store, 'duos');
  if (mostDuos) {
    achievements.push({
      type: DUETOS_ACHIEVEMENTS.MOST_DUOS,
      playerId: mostDuos.playerId,
      value: mostDuos.value,
    });
  }

  // Most groups: had a pair with more than one other person
  const { most: mostGroups } = utils.achievements.getMostAndLeastOf(store, 'groups');
  if (mostGroups) {
    achievements.push({
      type: DUETOS_ACHIEVEMENTS.MOST_GROUPS,
      playerId: mostGroups.playerId,
      value: mostGroups.value,
    });
  }

  // Most left out
  const { most: mostLeftOut } = utils.achievements.getMostAndLeastOf(store, 'leftOut');
  if (mostLeftOut) {
    achievements.push({
      type: DUETOS_ACHIEVEMENTS.MOST_LEFT_OUT,
      playerId: mostLeftOut.playerId,
      value: mostLeftOut.value,
    });
  }

  return achievements;
};
