import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

/**
 * Check if the current user is associated with given property
 * @param {string} propertyName - the property to be check in the state
 * @param {*} state - the game state
 * @returns {boolean}
 */
export function useIsUserThe(propertyName = 'activePlayer', state = {}) {
  const [username] = useGlobalState('username');
  const [isUser, setIsUser] = useState(false);

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setIsUser(state?.[propertyName] === username);
  }, [state, username, propertyName]);

  return isUser;
}
