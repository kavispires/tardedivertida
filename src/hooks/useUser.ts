import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

/**
 * Get player data for the user
 * @param players
 * @returns
 */
export function useUser(players: Players): Player | {} {
  const [userId] = useGlobalState('userId');
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userId) {
      setUser(players?.[userId]);
    }
  }, [players, userId]);

  return user;
}
