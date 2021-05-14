import { useEffect, useState } from 'react';
import { useGlobalState } from './useGlobalState';

export function useAmIActive(state, propertyName = 'activePlayer') {
  const [me] = useGlobalState('me');
  const [amIActive, setAmIActive] = useState(false);

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    setAmIActive(state?.[propertyName] === me);
  }, [state, me, propertyName]);

  return amIActive;
}
