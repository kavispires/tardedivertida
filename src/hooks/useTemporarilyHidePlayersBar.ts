import { useEffectOnce } from 'react-use';
// Internal
import { useGlobalState } from './useGlobalState';

export function useTemporarilyHidePlayersBar(ignore = false) {
  const [, setShowPlayersBar] = useGlobalState('showPlayersBar');

  useEffectOnce(() => {
    setShowPlayersBar(ignore);
    return () => {
      setShowPlayersBar(true);
    };
  });
}
