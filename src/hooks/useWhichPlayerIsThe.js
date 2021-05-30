import { useEffect, useState } from 'react';

/**
 * Gets player that is assigned to a property in the state
 * @param {string} propertyName
 * @param {object} state
 * @param {object} players
 * @returns {object} a player instance
 */
export function useWhichPlayerIsThe(propertyName = 'activePlayer', state = {}, players = {}) {
  const [activePlayer, setActivePlayer] = useState({});

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    const activePlayer = state?.[propertyName];
    setActivePlayer(players?.[activePlayer]);
  }, [players, propertyName, state]);

  return activePlayer;
}
