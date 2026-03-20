import { groupBy } from 'lodash';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/game';

export function useGroupedVotes(playersList: GamePlayer[]) {
  return useMemo(() => {
    return orderBy(
      Object.entries(groupBy(playersList, (player) => player.data.value)),
      [(o) => o?.[1]?.length],
      ['desc'],
    );
  }, [playersList]);
}
