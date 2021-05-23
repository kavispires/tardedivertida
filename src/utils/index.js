/**
 * Extract the gameId from react history
 * @param {object} history
 * @returns {string}
 */
export const getGameIdFromURL = (history) => {
  const { pathname = '/' } = history?.location ?? {};
  return pathname.substring(1);
};

/**
 * Extract the gameId from react history.location
 * @param {object} history
 * @returns {string}
 */
export const getGameIdFromLocation = (location) => {
  const { pathname = '/' } = location ?? {};
  return pathname.substring(1);
};

/**
 * Verify if the game id exists and has the correct length
 * @param {string} gameId
 * @returns
 */
export const isValidGameId = (gameId) => {
  return gameId && gameId.length === 4;
};

/**
 * Get random element/item from a list
 * @param {array} list
 * @returns one random item
 */
export const getRandomItem = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Get date from now within the given seconds
 * @param {number} seconds
 * @returns
 */
export const inNSeconds = (seconds) => {
  return Date.now() + seconds * 1000;
};

/**
 * Get color name from letter
 * @param {string} letter
 * @returns
 */
export const getColorFromLetter = (letter) => {
  return (
    {
      A: 'red',
      B: 'blue',
      C: 'green',
      D: 'yellow',
      E: 'pink',
      F: 'purple',
      G: 'teal',
      H: 'orange',
      I: 'coffee',
      J: 'navy',
      K: 'light-green',
      L: 'brown',
      M: 'hot-pink',
      N: 'violet',
      O: 'forest',
      P: 'cream',

      // repeats
      Q: 'red',
      R: 'blue',
      S: 'green',
      T: 'yellow',
      U: 'pink',
      V: 'purple',
      W: 'teal',
      X: 'none',
      Y: 'orange',
      Z: 'coffee',
    }[letter] ?? 'none'
  );
};

/**
 * Gets color name from index
 * @param {number} letter
 * @returns
 */
export const getColorFromIndex = (letter) => {
  return (
    [
      'red',
      'blue',
      'green',
      'yellow',
      'pink',
      'purple',
      'teal',
      'orange',
      'coffee',
      'navy',
      'light-green',
      'brown',
      'hot-pink',
      'violet',
      'forest',
      'cream',
    ][letter] ?? 'none'
  );
};
