import { useEffect } from 'react';
import { useGlobalState } from './useGlobalState';

export function useTemporarilyHidePlayersBar() {
  const [, setShowPlayersBar] = useGlobalState('showPlayersBar');

  useEffect(() => {
    setShowPlayersBar(false);
    return () => {
      setShowPlayersBar(true);
    };
  }, []); // eslint-disable-line
}
