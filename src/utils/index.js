/**
 * Creates a copy of given object
 * @param {object} obj
 * @returns {object}
 */
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

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
 * Verify if the game id exists and has the correct length
 * @param {string} gameId
 * @returns
 */
export const isValidGameId = (gameId) => {
  return gameId && gameId.length === 4;
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
 * Get the team name that is not active
 * @param {object|array} teams
 * @param {string} activeTeam
 * @returns {string}
 */
export const getOppositeTeam = (teams, activeTeam) => {
  if (!teams || !activeTeam || teams?.length < 2 || teams?.length > 2) return '?';

  const teamsNames = Array.isArray(teams) ? teams : Object.keys(teams);
  if (teamsNames[0] === activeTeam) return teamsNames[1];
  else return teamsNames[0];
};

/**
 * Get given players from list of ids
 * @param {string[]} playerIds
 * @param {object} players
 * @param {boolean} justNames if true, only return names
 * @returns
 */
export const getPlayersFromIds = (playerIds, players, justNames = false) => {
  return playerIds.map((playerId) => {
    const player = players[playerId];
    if (justNames) return player.name;
    return player;
  });
};

/**
 * Orders array by a value its item object
 * @param {object[]} list
 * @param {string|string[]} properties
 * @param {string|string[]} orders
 * @returns {object[]}
 */
export const orderBy = (list, properties, orders) => {
  function sortBy(_key, _cb) {
    if (!_cb) _cb = () => 0;
    return (a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : _cb(a, b));
  }

  function sortByDesc(key, _cb) {
    if (!_cb) _cb = () => 0;
    return (b, a) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : _cb(b, a));
  }

  let cb = () => 0;
  const p = Array.isArray(properties) ? properties.reverse() : [properties];
  const o = Array.isArray(orders) ? orders.reverse() : [orders];

  for (const [i, key] of p.entries()) {
    const order = o[i] ?? o[0] ?? 'asc';
    if (order === 'asc') {
      cb = sortBy(key, cb);
    } else if (order === 'desc') {
      cb = sortByDesc(key, cb);
    } else {
      throw new Error(`Unsupported order "${order}"`);
    }
  }

  return [...list].sort(cb);
};

/**
 * Determines if it should output the singular or plural argument depending on given quantity
 * @param {number} quantity
 * @param {string} singular
 * @param {string} plural
 * @returns
 */
export const pluralize = (quantity, singular, plural) => {
  if (!plural) return singular;
  return quantity === 1 ? singular : plural;
};
