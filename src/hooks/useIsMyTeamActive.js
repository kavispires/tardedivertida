import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useIsMyTeamActive(state, players) {
  const [me] = useGlobalState('me');
  const [isMyTeamActive, setIsMyTeamActive] = useState(false);

  // Determine if user's team is active
  useEffect(() => {
    setIsMyTeamActive(state?.activeTeam === players?.[me]?.team);
  }, [state, me, players]);

  return isMyTeamActive;
}
