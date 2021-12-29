import { useEffect, useState } from 'react';
import { useGlobalState } from '.';

/**
 * Gets player that is assigned to a property in the state
 * @param propertyName
 * @param state
 * @param players
 * @returns a player instance, a boolean if the player is assigned to given property
 */
export function useWhichPlayerIsThe(
  propertyName = 'activePlayer',
  state: PlainObject = {},
  players: Players = {}
): [Player | {}, boolean] {
  const [userId] = useGlobalState('userId');
  const [activePlayer, setActivePlayer] = useState({});
  const [isUser, setIsUser] = useState(false);

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    const activePlayer = state?.[propertyName];
    setActivePlayer(players?.[activePlayer] ?? {});
    setIsUser(state?.[propertyName] === userId);
  }, [players, propertyName, state, userId]);

  return [activePlayer, isUser];
}
