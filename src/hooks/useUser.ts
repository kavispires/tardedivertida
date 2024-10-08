import { useEffect, useState } from 'react';
// Types
import type { GameState } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { PLACEHOLDER_PLAYER, VIEWER_ID } from 'utils/constants';
// Internal
import { useGlobalState } from './useGlobalState';

const THREE_MINUTES = 3 * 60 * 1000;

/**
 * Get player data for the user
 * @param players
 * @returns
 */
export function useUser(players: GamePlayers, state?: GameState): GamePlayer {
  const [userId] = useGlobalState('userId');
  const [user, setUser] = useGlobalState('user');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (userId === VIEWER_ID) {
      setUser({
        ...PLACEHOLDER_PLAYER,
        id: VIEWER_ID,
        ready: true,
      });
      return;
    }

    if (userId && players?.[userId]) {
      setUser(players?.[userId]);
    }
  }, [players, userId, setUser]);

  useEffect(() => {
    if (userId === VIEWER_ID) {
      setIsReady(false);
      return;
    }
    // Check if user is ready and check if user has been ready after the last state change
    if (userId && user?.ready === false) {
      setIsReady(false);
      return;
    }

    if (!state?.updatedAt) {
      setIsReady(user?.ready ?? true);
      return;
    }

    // If state was updated after the player was updated, data might not be synced
    if (userId && user?.updatedAt < state?.updatedAt) {
      setIsReady(false);
      return;
    }

    setIsReady(true);
  }, [userId, user?.ready, user?.updatedAt, state?.updatedAt]);

  return {
    ...user,
    isReady,
    online: user.updatedAt ? Date.now() - user.updatedAt < THREE_MINUTES : false,
  };
}
