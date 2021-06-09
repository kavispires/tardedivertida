import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useIsUsersTeamActive(state, players) {
  const [username] = useGlobalState('username');
  const [isUsersTeamActive, setIsUsersTeamActive] = useState(false);

  // Determine if user's team is active
  useEffect(() => {
    setIsUsersTeamActive(state?.activeTeam === players?.[username]?.team);
  }, [state, username, players]);

  return isUsersTeamActive;
}
