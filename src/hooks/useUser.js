import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useUser(players) {
  const [username] = useGlobalState('username');
  const [user, setUser] = useState({});

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setUser(players?.[username]);
  }, [players, username]);

  return user;
}
