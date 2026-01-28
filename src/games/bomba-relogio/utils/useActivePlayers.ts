import { sortBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Utils
import { PLACEHOLDER_PLAYER } from 'utils/constants';
// Internal
import type { Status } from './types';

type APlayer = GamePlayers[keyof GamePlayers];

export function useActivePlayers(
  status: Status,
  players: GamePlayers,
): {
  previousInvestigator: APlayer | null;
  isThePreviousInvestigator: boolean;
  previousTargetPlayer: APlayer | null;
  isThePreviousTargetPlayer: boolean;
  currentInvestigator: APlayer;
  isTheCurrentInvestigator: boolean;
  targetPlayer: APlayer | null;
  isTheTargetPlayer: boolean;
} {
  const [userId] = useGlobalState('userId');

  return useMemo(() => {
    const activePlayerIdsArray = sortBy(Object.keys(status.activePlayerIds)).map(
      (key) => status.activePlayerIds[key],
    );

    const currentInvestigatorId = activePlayerIdsArray.at(-2);
    const targetPlayerId = activePlayerIdsArray.at(-1) ?? null;
    const previousInvestigatorId = targetPlayerId ? null : (activePlayerIdsArray.at(-3) ?? null);
    const previousTargetPlayerId = targetPlayerId ? null : (activePlayerIdsArray.at(-2) ?? null);

    return {
      previousInvestigator: previousInvestigatorId
        ? (players?.[previousInvestigatorId] ?? PLACEHOLDER_PLAYER)
        : null,
      isThePreviousInvestigator: previousInvestigatorId === userId,
      previousTargetPlayer: previousTargetPlayerId
        ? (players?.[previousTargetPlayerId] ?? PLACEHOLDER_PLAYER)
        : null,
      isThePreviousTargetPlayer: previousTargetPlayerId === userId,
      currentInvestigator: currentInvestigatorId
        ? (players?.[currentInvestigatorId] ?? PLACEHOLDER_PLAYER)
        : PLACEHOLDER_PLAYER,
      isTheCurrentInvestigator: currentInvestigatorId === userId,
      targetPlayer: targetPlayerId ? (players?.[targetPlayerId] ?? PLACEHOLDER_PLAYER) : null,
      isTheTargetPlayer: targetPlayerId === userId,
    };
  }, [players, status, userId]);
}
