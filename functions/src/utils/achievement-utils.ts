import { deepCopy } from './helpers';

/**
 * Sets up achievements in the store by created an achievements object with every player in it with given starting properties
 * @param players
 * @param store
 * @param properties
 * @return the achievements
 */
export const setup = (players: Players, store: PlainObject, properties: PlainObject) => {
  store.achievements = {};
  Object.keys(players).forEach((playerId) => {
    store.achievements[playerId] = { ...deepCopy(properties), playerId };
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
export const increaseAchievement = (
  store: PlainObject,
  playerId: PlayerId,
  property: string,
  value: number
) => {
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
export const pushAchievement = (store: PlainObject, playerId: PlayerId, property: string, value: any) => {
  store.achievements[playerId][property].push(value);
  return store.achievements;
};

/**
 * Get most and least of certain value else return null
 * @param store
 * @param property
 * @returns the most and least values
 */
export const getMostAndLeastOf = (store: PlainObject, property: string) => {
  let most: PlainObject[] = [];
  let least: PlainObject[] = [];

  Object.values(store.achievements).forEach((pa) => {
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
