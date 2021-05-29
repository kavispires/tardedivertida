import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useIsMyTeamActive(state, players) {
  const [username] = useGlobalState('username');
  const [isMyTeamActive, setIsMyTeamActive] = useState(false);

  // Determine if user's team is active
  useEffect(() => {
    setIsMyTeamActive(state?.activeTeam === players?.[username]?.team);
  }, [state, username, players]);

  return isMyTeamActive;
}
