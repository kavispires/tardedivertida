import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useUser(players) {
  const [userId] = useGlobalState('userId');
  const [user, setUser] = useState({});

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setUser(players?.[userId]);
  }, [players, userId]);

  return user;
}
