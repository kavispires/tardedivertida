import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useMe(players) {
  const [me] = useGlobalState('me');
  const [completeMe, setCompleteMe] = useState({});

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setCompleteMe(players?.[me]);
  }, [players, me]);

  return completeMe;
}
