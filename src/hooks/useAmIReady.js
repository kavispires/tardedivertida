import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useAmIReady(players, state = {}) {
  const [username] = useGlobalState('username');
  const [amIReady, setAmIReady] = useState(false);

  useEffect(() => {
    // Check if user is ready and check if user has been ready after the last state change
    if (players[username].ready === false) {
      setAmIReady(false);
      return;
    }

    if (!state?.updatedAt) {
      setAmIReady(true);
      return;
    }

    // If state was updated after the player was updated, data might not be synced
    if (players[username]?.updatedAt < state?.updatedAt) {
      setAmIReady(false);
      return;
    }

    setAmIReady(true);
  }, [username, players, state?.updatedAt]);

  return amIReady;
}
