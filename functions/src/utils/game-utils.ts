import { Players } from './interfaces';

// Shuffling

/**
 * Shuffle list copy
 * @param list
 * @returns
 */
export const shuffle = (list: any[]) => {
  const result = [...list];
  result.sort(() => Math.random() - 0.5);
  return result;
};

// Random

/**
 * Get random number
 * @param [min] inclusive
 * @param [max] inclusive
 * @returns a random number
 */
export const getRandomNumber = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Get random element/item from a list
 * @param list
 * @returns one random item
 */
export const getRandomItem = (list: any[]) => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Get random elements from a list
 * @param list
 * @param [quantity]
 * @returns random items
 */
export const getRandomItems = (list: any[], quantity = 1) => {
  const shuffledList = shuffle(list);
  const res = new Array(quantity).fill(null);
  for (let i = 0; i < res.length; i++) {
    res[i] = shuffledList[i];
  }
  return res;
};

/**
 * Get a random item from list that is not
 * @param list
 * @param used
 * @returns
 */
export const getRandomUniqueItem = (list: string[], used: string[]) => {
  const availableList = list.filter((i) => !used.includes(i));
  return getRandomItem(availableList);
};

/**
 * Get random unique items from a list
 * @param list
 * @param [used]
 * @param [quantity]
 * @returns
 */
export const getRandomUniqueItems = (list: string[], used: string[] = [], quantity = 1) => {
  const availableList = list.filter((i) => !used.includes(i));
  return getRandomItems(availableList, quantity);
};

/**
 * Gets the next item in a array
 * @param list
 * @param currentItem
 * @param wrap determine if the result should wrap to the beginning of the array
 * @returns
 */
export const getNextItem = (list: any[], currentItem: any, wrap = true) => {
  const currentIndex = list.findIndex((i) => i === currentItem);

  if (currentItem === -1) return null;

  if (currentIndex === list.length - 1) {
    return wrap ? list[0] : null;
  }

  return list[currentIndex + 1];
};

/**
 * Gets the previous item in a array
 * @param list
 * @param currentItem
 * @param wrap determine if the result should wrap to the end of the array
 * @returns
 */
export const getPreviousItem = (list: any[], currentItem: any, wrap = true) => {
  const currentIndex = list.findIndex((i) => i === currentItem);

  if (currentItem === -1) return null;

  if (currentIndex === 0) {
    return wrap ? list[list.length - 1] : null;
  }

  return list[currentIndex - 1];
};

/**
 * Remove item from list of strings
 * @param list
 * @param target
 * @returns
 */
export const removeItem = (list: string[], target: string): string[] => {
  return list.filter((item) => item !== target);
};

/**
 * Splits list into chunks of given size
 * @param list
 * @param [chunkSize] the size of the chunks the list is being split into
 * @returns
 */
export const sliceIntoChunks = (list: any[], chunkSize = 2) => {
  const res: any[] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

/**
 * Splits list into a number of parts
 * @param list
 * @param [numParts] how many parts it should be split into
 * @returns
 */
export const sliceInParts = (list: any[], numParts = 1) => {
  const partSize = Math.ceil(list.length / numParts);

  return sliceIntoChunks(list, partSize);
};

/**
 * Deal list items between players
 * @param list a list of items, usually cards ids
 * @param players players object
 * @param [quantity] how many items each player should get
 * @param [propertyName] what property should the items be attributed to
 * @param [recursive] if not enough items, restart from the beginning
 * @returns
 */
export const dealList = (
  list: any[],
  players: Players,
  quantity = 1,
  propertyName = 'hand',
  recursive = false
): Players => {
  const playerIds = Object.keys(players);
  // Ensure there are enough cards
  const newList = recursive && playerIds.length * quantity < list.length ? [...list, ...list] : list;
  const hands = sliceIntoChunks(newList, quantity);

  playerIds.forEach((playerId, index) => {
    players[playerId][propertyName] = hands[index];
  });

  return players;
};
