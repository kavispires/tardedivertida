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
