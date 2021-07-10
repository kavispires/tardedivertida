import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useIsUsersTeamActive(state, players) {
  const [userId] = useGlobalState('userId');
  const [isUsersTeamActive, setIsUsersTeamActive] = useState(false);

  // Determine if user's team is active
  useEffect(() => {
    setIsUsersTeamActive(state?.activeTeam === players?.[userId]?.team);
  }, [state, userId, players]);

  return isUsersTeamActive;
}
