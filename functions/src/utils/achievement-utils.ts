import { calculateAverage, removeDuplicates } from './game-utils';
import { deepCopy } from './helpers';
import { getListOfPlayers } from './players-utils';

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
 * @param store
 * @param playerId
 * @param property
 * @param value
 * @returns the achievements
 */
export const increase = (store: PlainObject, playerId: PlayerId, property: string, value: number) => {
  store.achievements[playerId][property] += value;
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
  store.achievements[playerId][property].push(value);
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
  index: number
) => {
  store.achievements[playerId][property][index] = value;
  return store.achievements;
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
  condition: (args: any) => boolean = () => true
) => {
  let most: PlainObject[] = [];
  let least: PlainObject[] = [];

  const achievements = Object.values(store.achievements).filter(
    (a: any) => !ineligiblePlayers.includes(a.playerId)
  );

  achievements.forEach((pa) => {
    const achievement = pa as PlainObject;
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
    most: most.length === 1 ? most[0] : null,
    least: least.length === 1 ? least[0] : null,
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
  ineligiblePlayers: PlayerId[] = []
) => {
  let most: PlainObject[] = [];
  let least: PlainObject[] = [];

  const eligibleAchievements = Object.values(store.achievements).filter((pa) => {
    const achievement = pa as PlainObject;
    return !ineligiblePlayers.includes(achievement.playerId);
  });

  const achievementsAverages = eligibleAchievements.map((pa) => {
    const achievement = pa as PlainObject;
    if (Array.isArray(achievement[property]) && achievement[property].every(Number)) {
      achievement[property] = calculateAverage(achievement[property], true);
    }
    return achievement;
  });

  achievementsAverages.forEach((pa) => {
    const achievement = pa as PlainObject;
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
    most: most.length === 1 ? most[0] : null,
    least: least.length === 1 ? least[0] : null,
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
  ineligiblePlayers: PlayerId[] = []
) => {
  Object.values(store.achievements).forEach((pa) => {
    const achievement = pa as PlainObject;
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
  ineligiblePlayers: PlayerId[] = []
) => {
  Object.values(store.achievements).forEach((pa) => {
    const achievement = pa as PlainObject;
    achievement[property] = achievement[property].findIndex(Boolean);
  });

  return getMostAndLeastOf(store, property, ineligiblePlayers, (v) => v >= 0);
};
