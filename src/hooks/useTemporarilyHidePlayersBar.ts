import { useEffect } from 'react';
// Internal
import { useGlobalState } from './useGlobalState';

export function useTemporarilyHidePlayersBar(ignore = false) {
  const [, setShowPlayersBar] = useGlobalState('showPlayersBar');

  useEffect(() => {
    setShowPlayersBar(ignore ? true : false);
    return () => {
      setShowPlayersBar(true);
    };
  }, []); // eslint-disable-line
}
