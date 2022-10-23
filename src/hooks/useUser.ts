import { useEffect, useState } from 'react';
import { VIEWER_ID } from 'utils/constants';
import { useGlobalState } from './useGlobalState';

/**
 * Get player data for the user
 * @param players
 * @returns
 */
export function useUser(players: Players): GamePlayer {
  const [userId] = useGlobalState('userId');
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userId === VIEWER_ID) {
      setUser({
        id: VIEWER_ID,
        ready: true,
      });
      return;
    }

    if (userId) {
      setUser(players?.[userId]);
    }
  }, [players, userId]);

  return user;
}
