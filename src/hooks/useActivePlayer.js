import { useEffect, useState } from 'react';

export function useActivePlayer(state, players, propertyName = 'activePlayer') {
  const [activePlayer, setActivePlayer] = useState({});

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    const activePlayer = state?.[propertyName];
    setActivePlayer(players?.[activePlayer]);
  }, [players, propertyName, state]);

  return activePlayer;
}
