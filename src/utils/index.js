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
 * Verify if the game id exists and has the correct length
 * @param {string} gameId
 * @returns
 */
export const isValidGameId = (gameId) => {
  return gameId && gameId.length === 4;
};
