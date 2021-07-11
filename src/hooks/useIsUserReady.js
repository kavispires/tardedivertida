import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useIsUserReady(players, state = {}) {
  const [userId] = useGlobalState('userId');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user is ready and check if user has been ready after the last state change
    if (players[userId].ready === false) {
      setIsReady(false);
      return;
    }

    if (!state?.updatedAt) {
      setIsReady(true);
      return;
    }

    // If state was updated after the player was updated, data might not be synced
    if (players[userId]?.updatedAt < state?.updatedAt) {
      setIsReady(false);
      return;
    }

    setIsReady(true);
  }, [userId, players, state?.updatedAt]);

  return isReady;
}
