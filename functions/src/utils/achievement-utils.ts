import { calculateAverage, removeDuplicates } from './game-utils';
import { deepCopy } from './helpers';
import { getListOfPlayers } from './players-utils';

interface StoreAchievement {
  playerId: PlayerId;
  [key: string]: any;
}

interface ResultAchievement {
  playerId: PlayerId;
  value: number;
}

type AchievementResult = {
  most: ResultAchievement | null;
  least: ResultAchievement | null;
};

/**
 * Sets up achievements in the store by created an achievements object with every player in it with given starting properties
 * @param players
 * @param store
 * @param properties
 * @return the achievements
 */
export const setup = (players: Players, store: PlainObject, properties: PlainObject) => {
  store.achievements = {};
  getListOfPlayers(players).forEach((player) => {
    store.achievements[player.id] = { ...deepCopy(properties), playerId: player.id };
  });

  return store.achievements;
};

/**
 * Adds a numeric value to given property in the achievements
 * @param store the store
 * @param playerId the player id
 * @param property the property to increase
 * @param value the value to increase
 * @returns the achievements
 */
export const increase = (store: PlainObject, playerId: PlayerId, property: string, value: number) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property] += value;
  }
  return store.achievements;
};

/**
 * Pushes a value to the achievements property array
 * @param store
 * @param playerId
 * @param property
 * @param value
 * @returns the achievements
 */
export const push = (store: PlainObject, playerId: PlayerId, property: string, value: any) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property].push(value);
  }
  return store.achievements;
};

/**
 * Inserts a value in a specific array index
 * @param store
 * @param playerId
 * @param property
 * @param value
 * @param index
 * @returns the achievements
 */
export const insert = (
  store: PlainObject,
  playerId: PlayerId,
  property: string,
  value: any,
  index: number,
) => {
  if (store.achievements[playerId] !== undefined) {
    store.achievements[playerId][property][index] = value;
  }
  return store.achievements;
};

/**
 * Get the exact value of a property and returns it in a ResultAchievement object
 * @param achievement - the achievement
 * @param property - the property to get the value from
 * @returns - the ResultAchievement object
 */
const getValue = (achievement: StoreAchievement, property: string): ResultAchievement => {
  return {
    playerId: achievement.playerId,
    value: achievement[property] ?? 0,
  };
};

/**
 * Get most and least of certain value else return null
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @param condition function to verify value (for example, if it's positive)
 * @returns the most and least values
 */
export const getMostAndLeastOf = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: PlayerId[] = [],
  condition: (args: any) => boolean = () => true,
): AchievementResult => {
  let most: StoreAchievement[] = [];
  let least: StoreAchievement[] = [];

  const achievements = Object.values<StoreAchievement>(store.achievements).filter(
    (a: any) => !ineligiblePlayers.includes(a.playerId),
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
    most: most.length === 1 ? getValue(most[0], property) : null,
    least: least.length === 1 ? getValue(least[0], property) : null,
  };
};

/**
 * Get most and least of certain property based on the average of the array of values
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @returns the most and least values
 */
export const getMostAndLeastOfAverage = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: PlayerId[] = [],
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
    most: most.length === 1 ? getValue(most[0], property) : null,
    least: least.length === 1 ? getValue(least[0], property) : null,
  };
};

/**
 * Get most and least of certain property based on the unique items of the array of values
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @returns the most and least values
 */
export const getMostAndLeastUniqueItemsOf = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: PlayerId[] = [],
): AchievementResult => {
  Object.values<StoreAchievement>(store.achievements).forEach((achievement) => {
    achievement[property] = removeDuplicates(achievement[property]).length;
  });

  return getMostAndLeastOf(store, property, ineligiblePlayers);
};

/**
 * Get most (latest) and least (earliest) of certain property based on the unique items of the array of values
 * @param store
 * @param property
 * @param ineligiblePlayers player Ids that should not count for the achievement
 * @returns the most and least values
 */
export const getEarliestAndLatestOccurrence = (
  store: PlainObject,
  property: string,
  ineligiblePlayers: PlayerId[] = [],
): AchievementResult => {
  Object.values<StoreAchievement>(store.achievements).forEach((achievement) => {
    achievement[property] = achievement[property].findIndex(Boolean);
  });

  return getMostAndLeastOf(store, property, ineligiblePlayers, (v) => v >= 0);
};

export const getOnlyExactMatch = (
  store: PlainObject,
  property: string,
  value: any,
  ineligiblePlayers: PlayerId[] = [],
): ResultAchievement | null => {
  const eligibleAchievements = Object.values<StoreAchievement>(store.achievements).filter((achievement) => {
    return !ineligiblePlayers.includes(achievement.playerId);
  });

  const achievements = eligibleAchievements.filter((achievement) => {
    return achievement[property] === value;
  });

  return achievements.length === 1 ? getValue(achievements[0], property) : null;
};
