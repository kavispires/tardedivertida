import { SEPARATOR } from './constants';

/**
 * Creates a copy of given object
 * @param obj
 * @returns
 */
export const deepCopy = (obj: PlainObject): PlainObject => JSON.parse(JSON.stringify(obj));

/**
 * Extract the gameId from react history
 * @param history
 * @returns
 */
export const getGameIdFromURL = (history: PlainObject): string => {
  const { pathname = '/' } = history?.location ?? {};
  return pathname.substring(1);
};

/**
 * Extract the gameId from react history.location
 * @param history
 * @returns
 */
export const getGameIdFromLocation = (location: PlainObject): string => {
  const { pathname = '/' } = location ?? {};
  return pathname.substring(1);
};

/**
 * Get random element/item from a list
 * @param list
 * @returns one random item
 */
export const getRandomItem = (list: any[]): any => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Get date from now within the given seconds
 * @param seconds
 * @returns
 */
export const inNSeconds = (seconds: number): DateMilliseconds => {
  return Date.now() + seconds * 1000;
};

/**
 * Flag indicating if the environment is for development and not storybook
 */
export const isDevEnv: boolean = process.env.NODE_ENV === 'development' && window.location.port !== '6006';

/**
 * Verify if the game id exists and has the correct length
 * @param gameId
 * @returns
 */
export const isValidGameId = (gameId: GameId): boolean => {
  return Boolean(gameId) && gameId.length === 4;
};

/**
 * Gets color name from index
 * @param index
 * @returns
 */
export const getColorFromIndex = (index: number): string => {
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
    ][index] ?? 'none'
  );
};

/**
 * Get color name from letter
 * @param letter
 * @returns
 */
export const getColorFromLetter = (letter: string): string => {
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
 * @param teams
 * @param activeTeam
 * @returns
 * @deprecated
 */
export const getOppositeTeam = (teams: PlainObject | any[], activeTeam: string) => {
  if (!teams || !activeTeam || teams?.length < 2 || teams?.length > 2) return '?';

  const teamsNames = Array.isArray(teams) ? teams : Object.keys(teams);
  if (teamsNames[0] === activeTeam) return teamsNames[1];
  else return teamsNames[0];
};

/**
 * Get given players from list of ids
 * @param  playerIds
 * @param players
 * @param justNames if true, only return names
 * @returns
 */
export const getPlayersFromIds = (
  playerIds: PlayerId[],
  players: Players,
  justNames = false
): (Player | PlayerName)[] => {
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
export const orderBy = (list: PlainObject[], properties: string[], orders: string[]): PlainObject[] => {
  // function sortBy(_key, _cb) {
  //   if (!_cb) _cb = () => 0;
  //   return (a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : _cb(a, b));
  // }

  // function sortByDesc(key, _cb) {
  //   if (!_cb) _cb = () => 0;
  //   return (b, a) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : _cb(b, a));
  // }

  // let cb = () => 0;
  // const p = Array.isArray(properties) ? properties.reverse() : [properties];
  // const o = Array.isArray(orders) ? orders.reverse() : [orders];

  // for (const [i, key] of p.entries()) {
  //   const order = o[i] ?? o[0] ?? 'asc';
  //   if (order === 'asc') {
  //     cb = sortBy(key, cb);
  //   } else if (order === 'desc') {
  //     cb = sortByDesc(key, cb);
  //   } else {
  //     throw new Error(`Unsupported order "${order}"`);
  //   }
  // }

  // return [...list].sort(cb);
  console.log(properties);
  console.log(orders);
  return list;
};

/**
 * Determines if it should output the singular or plural argument depending on given quantity
 * @param quantity
 * @param singular
 * @param plural
 * @returns
 */
export const pluralize = (quantity: number, singular: string, plural: string): string => {
  if (!plural) return singular;
  return quantity === 1 ? singular : plural;
};

/**
 * Shuffle list copy
 * @param {any[]} list
 * @returns
 */
export const shuffle = (list: any[]): any[] => {
  const result = [...list];
  result.sort(() => Math.random() - 0.5);
  return result;
};

/**
 * Builds entry id from array elements separated by the separator
 * @param arr
 * @returns
 */
export const getEntryId = (arr: string[]): string => arr.join(SEPARATOR);

/**
 * Check if array has duplicates
 * @param arr
 * @returns
 */
export const hasDuplicates = (arr: any): boolean => {
  return new Set(arr).size !== arr.length;
};
