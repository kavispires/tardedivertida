import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

/**
 * Check if the current user is associated with given property
 * @param propertyName - the property to be check in the state
 * @param state - the game state
 * @returns
 */
export function useIsUserThe(propertyName = 'activePlayer', state: State = {}): boolean {
  const [userId] = useGlobalState('userId');
  const [isUser, setIsUser] = useState(false);

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setIsUser(state?.[propertyName] === userId);
  }, [state, userId, propertyName]);

  return isUser;
}
