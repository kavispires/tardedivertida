/**
 * @deprecated This file is deprecated. Use the new achievements tool-kit instead.
 * See: functions/src/utils/tool-kits/achievements.ts
 *
 * For new games, use:
 * ```
 * import { achievementBuilder } from '../../utils/tool-kits';
 * const achievements = achievementBuilder('GAME_NAME').counter(...).build();
 * ```
 */

import { calculateAverage } from './helpers';
import { getListOfPlayers } from './players-utils';
import { cloneDeep, uniq } from 'lodash';

interface StoreAchievement {
  playerId: UID;
  [key: string]: AnyOrUnknownPlaceholder;
}

interface ResultAchievement {
  playerId: UID;
  value: number;
}

type AchievementResult = {
  most: ResultAchievement | null;
  least: ResultAchievement | null;
};

/**
 * Sets up achievements in the store by created an achievements object with every player in it with given starting properties
 * @param players
 * @param properties
 * @return the achievements
 * @deprecated Use achievementBuilder().build().setup() instead
 */
export const setup = (players: Players, properties: PlainObject) => {
  const achievements = {};
  getListOfPlayers(players).forEach((player) => {
    achievements[player.id] = { ...cloneDeep(properties), playerId: player.id };
  });

  return achievements;
};

/**
 * Adds a numeric value to given property in the achievements
 * (Number Achievement)
 * @param store the store
 * @param playerId the player id
 * @param property the property to increase
 * @param value the value to increase
 * @returns the achievements
 * @deprecated Use achievementBuilder().build().increase() instead
 */
export const increase = (store: PlainObject, playerId: UID, property: string, value: number) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property] = (store.achievements[playerId][property] || 0) + value;
  }
  return store.achievements;
};

/**
 * Pushes a value to the achievements property array
 * (Array Achievement)
 * @param store
 * @param playerId
 * @param property
 * @param value
 * @returns the achievements
 * @deprecated Use achievementBuilder().build().push() instead
 */
export const push = (store: PlainObject, playerId: UID, property: string, value: unknown) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property].push(value);
  }
  return store.achievements;
};

/**
 * Inserts a value in a specific array index
 * (Array Achievement)
 * @param store
 * @param playerId
 * @param property
 * @param value
 * @param index
 * @returns the achievements
 * @deprecated Use achievementBuilder().build().insert() instead
 */
export const insert = (
  store: PlainObject,
  playerId: UID,
  property: string,
  value: unknown,
  index: number,
) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property][index] = value;
  }
  return store.achievements;
};

/**
 * Adds a value to the last element of a specified property array for a given player in the store.
 * (Array Achievement)
 *
 * @param store - The store object containing player achievements.
 * @param playerId - The ID of the player whose achievement property will be updated.
 * @param property - The property name of the achievement to be updated.
 * @param value - The value to be added to the last element of the specified property array.
 * @returns The updated achievements object from the store.
 * @deprecated Use achievementBuilder().build().addToLast() instead
 */
export const addToLast = (store: PlainObject, playerId: UID, property: string, value: number) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property][store.achievements[playerId][property].length - 1] += value;
  }
  return store.achievements;
};

/**
 * Get the exact value of a property and returns it in a ResultAchievement object
 * @param achievement - the achievement
 * @param property - the property to get the value from
 * @returns - the ResultAchievement object
 */
const _getValue = (achievement: StoreAchievement, property: string): ResultAchievement => {
  return {
    playerId: achievement.playerId,
    value: achievement[property] ?? 0,
  };
};

/**
 * Get most and least of certain value else return null
 * (Number Achievement)
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @param condition function to verify value (for example, if it's positive)
 * @returns the most and least values
 * @deprecated Use achievementBuilder().build().calculate() with counter type instead
 */
export const getMostAndLeastOf = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: UID[] = [],
  condition: (args) => boolean = () => true,
): AchievementResult => {
  let most: StoreAchievement[] = [];
  let least: StoreAchievement[] = [];

  const achievements = Object.values<StoreAchievement>(store.achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  achievements.forEach((achievement) => {
    if (condition(achievement[property])) {
      if (!most[0] || most[0][property] === achievement[property]) {
        most.push(achievement);
      } else if (most[0][property] < achievement[property]) {
        most = [achievement];
      }

      if (!least[0] || least[0][property] === achievement[property]) {
        least.push(achievement);
      } else if (least[0][property] > achievement[property]) {
        least = [achievement];
      }
    }
  });

  return {
    most: most.length === 1 ? _getValue(most[0], property) : null,
    least: least.length === 1 ? _getValue(least[0], property) : null,
  };
};

/**
 * Get most and least of certain property based on the average of the array of values
 * (Array Achievement)
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @returns the most and least values
 * @deprecated Use achievementBuilder().build().calculate() with array average type instead
 */
export const getMostAndLeastOfAverage = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: UID[] = [],
): AchievementResult => {
  let most: StoreAchievement[] = [];
  let least: StoreAchievement[] = [];

  const eligibleAchievements = Object.values<StoreAchievement>(store.achievements).filter((achievement) => {
    return !ineligiblePlayers.includes(achievement.playerId);
  });

  const achievementsAverages = eligibleAchievements.map((achievement) => {
    if (Array.isArray(achievement[property]) && achievement[property].every(Number)) {
      achievement[property] = calculateAverage(achievement[property], true);
    }
    return achievement;
  });

  achievementsAverages.forEach((achievement) => {
    if (!most[0] || most[0][property] === achievement[property]) {
      most.push(achievement);
    } else if (most[0][property] < achievement[property]) {
      most = [achievement];
    }

    if (!least[0] || least[0][property] === achievement[property]) {
      least.push(achievement);
    } else if (least[0][property] > achievement[property]) {
      least = [achievement];
    }
  });

  return {
    most: most.length === 1 ? _getValue(most[0], property) : null,
    least: least.length === 1 ? _getValue(least[0], property) : null,
  };
};

/**
 * Get most and least of certain property based on the unique items of the array of values
 * (Array Achievement)
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @returns the most and least values
 * @deprecated Use achievementBuilder().build().calculate() with array uniqueItems type instead
 */
export const getMostAndLeastUniqueItemsOf = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: UID[] = [],
): AchievementResult => {
  Object.values<StoreAchievement>(store.achievements).forEach((achievement) => {
    achievement[property] = uniq(achievement[property]).length;
  });

  return getMostAndLeastOf(store, property, ineligiblePlayers);
};

/**
 * Get most (latest) and least (earliest) of certain property based on the unique items of the array of values
 * (Array Achievement)
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @returns the most and least values
 * @deprecated Use achievementBuilder().build().calculate() with array occurrence type instead
 */
export const getEarliestAndLatestOccurrence = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: UID[] = [],
): AchievementResult => {
  Object.values<StoreAchievement>(store.achievements).forEach((achievement) => {
    achievement[property] = achievement[property].findIndex(Boolean);
  });

  return getMostAndLeastOf(store, property, ineligiblePlayers, (v) => v >= 0);
};

/**
 * Retrieves the only achievement that exactly matches the specified property and value from the store,
 * excluding any achievements associated with ineligible players.
 *
 * @param store - The store containing achievements.
 * @param property - The property to match against.
 * @param value - The value to match for the specified property.
 * @param ineligiblePlayers - An optional array of player IDs to exclude from the search.
 * @returns The achievement that exactly matches the specified property and value, or null if there is not exactly one match.
 * @deprecated Use achievementBuilder().build().calculate() with exactMatch type instead
 */
export const getOnlyExactMatch = (
  store: PlainObject,
  property: string,
  value: unknown,
  ineligiblePlayers: UID[] = [],
): ResultAchievement | null => {
  const eligibleAchievements = Object.values<StoreAchievement>(store.achievements).filter((achievement) => {
    return !ineligiblePlayers.includes(achievement.playerId);
  });

  const achievements = eligibleAchievements.filter((achievement) => {
    return achievement[property] === value;
  });

  return achievements.length === 1 ? _getValue(achievements[0], property) : null;
};

/**
 * Retrieves all player IDs that have a truthy value for the specified achievement property,
 * excluding ineligible players.
 *
 * @param store - The store containing achievements
 * @param property - The property to check for truthy values
 * @param ineligiblePlayers - An optional array of player IDs to exclude from the results
 * @returns An array of player IDs that have a truthy value for the specified property
 * @deprecated Use achievementBuilder().build().calculate() with truthy type instead
 */
export const getPlayersWithTruthyAchievement = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: UID[] = [],
): UID[] => {
  const achievements = Object.values<StoreAchievement>(store.achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  return achievements.filter((achievement) => Boolean(achievement[property])).map((a) => a.playerId);
};

/**
 * Retrieves the highest and lowest occurrences of a specified property from a store of achievements,
 * excluding ineligible players.
 *
 * @param store - The store containing achievements.
 * @param property - The property to evaluate for highest and lowest occurrences.
 * @param ineligiblePlayers - An optional array of player IDs to exclude from the evaluation.
 * @returns An object containing the highest and lowest occurrences of the specified property.
 *          If there are multiple achievements with the same highest or lowest value, the result will be null.
 * @deprecated Use achievementBuilder().build().calculate() instead
 */
export const getHighestAndLowestOccurrences = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: UID[] = [],
): AchievementResult => {
  let highest: StoreAchievement[] = [];
  let lowest: StoreAchievement[] = [];

  const achievements = Object.values<StoreAchievement>(store.achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  achievements.forEach((achievement) => {
    if (!highest[0] || highest[0][property] === achievement[property]) {
      highest.push(achievement);
    } else if (highest[0][property] < achievement[property]) {
      highest = [achievement];
    }

    if (!lowest[0] || lowest[0][property] === achievement[property]) {
      lowest.push(achievement);
    } else if (lowest[0][property] > achievement[property]) {
      lowest = [achievement];
    }
  });

  return {
    most: highest.length === 1 ? _getValue(highest[0], property) : null,
    least: lowest.length === 1 ? _getValue(lowest[0], property) : null,
  };
};
