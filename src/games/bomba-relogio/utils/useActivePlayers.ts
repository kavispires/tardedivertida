import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Utils
import { PLACEHOLDER_PLAYER } from 'utils/constants';
// Internal
import type { Status } from './types';

export function useActiveInvestigator(
  status: Status,
  players: GamePlayers,
): [GamePlayers[keyof GamePlayers], boolean] {
  const [userId] = useGlobalState('userId');

  return useMemo(() => {
    if (status.activePlayerIds?.length > 1) {
      const activePlayerId = status.activePlayerIds[status.activePlayerIds.length - 2];
      const player = players?.[activePlayerId] ?? PLACEHOLDER_PLAYER;
      const userIsActive = activePlayerId === userId;
      return [player, userIsActive];
    }

    const activePlayerId = status.activePlayerIds[0];
    const player = players?.[activePlayerId] ?? PLACEHOLDER_PLAYER;
    const userIsActive = activePlayerId === userId;
    return [player, userIsActive];
  }, [players, status, userId]);
}

export function useTargetedPlayer(
  status: Status,
  players: GamePlayers,
): [GamePlayers[keyof GamePlayers] | null, boolean] {
  const [userId] = useGlobalState('userId');

  return useMemo(() => {
    if (status.activePlayerIds?.length > 1) {
      const targetPlayerId = status.activePlayerIds[status.activePlayerIds.length - 1];
      const player = players?.[targetPlayerId] ?? PLACEHOLDER_PLAYER;
      const userIsTarget = targetPlayerId === userId;
      return [player, userIsTarget];
    }

    return [null, false];
  }, [players, status, userId]);
}
