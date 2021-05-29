import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useIsUser(state, propertyName = 'activePlayer') {
  const [username] = useGlobalState('username');
  const [isUser, setIsUser] = useState(false);

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setIsUser(state?.[propertyName] === username);
  }, [state, username, propertyName]);

  return isUser;
}
