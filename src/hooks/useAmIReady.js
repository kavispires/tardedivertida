import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useAmIReady(players, state = {}) {
  const [me] = useGlobalState('me');
  const [amIReady, setAmIReady] = useState(false);

  useEffect(() => {
    // Check if user is ready and check if user has been ready after the last state change
    if (players[me].ready === false) {
      setAmIReady(false);
      return;
    }

    if (!state?.updatedAt) {
      setAmIReady(true);
      return;
    }

    // If state was updated after the player was updated, data might not be synced
    if (players[me]?.updatedAt < state?.updatedAt) {
      setAmIReady(false);
      return;
    }

    setAmIReady(true);
  }, [me, players, state?.updatedAt]);

  return amIReady;
}
