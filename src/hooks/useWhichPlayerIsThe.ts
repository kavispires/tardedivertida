import { useEffect, useState } from 'react';

/**
 * Gets player that is assigned to a property in the state
 * @param propertyName
 * @param state
 * @param players
 * @returns  a player instance
 */
export function useWhichPlayerIsThe(
  propertyName = 'activePlayer',
  state: State = {},
  players: Players = {}
): Player | {} {
  const [activePlayer, setActivePlayer] = useState({});

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    const activePlayer = state?.[propertyName];
    setActivePlayer(players?.[activePlayer]);
  }, [players, propertyName, state]);

  return activePlayer;
}
