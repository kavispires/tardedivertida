import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { useGlobalState } from './useGlobalState';
import { useLocalStorage } from './useLocalStorage';

const LS_KEY = 'cache';

/**
 * Saves and loads cache whenever the player uses it AA
 */
export function useCache() {
  const [cache, setCache] = useGlobalState('cache');
  const [getLocalStorage, setLocalStorage] = useLocalStorage();

  useEffect(() => {
    if (!isEmpty(cache)) {
      setLocalStorage({ [LS_KEY]: JSON.stringify(cache) });
    }
  }, [cache, setLocalStorage]);

  const resetCache = () => {
    setCache({});
    setLocalStorage({ [LS_KEY]: '{}' });
  };

  useEffectOnce(() => {
    if (isEmpty(cache)) {
      setCache(JSON.parse(getLocalStorage(LS_KEY)) ?? '{}');
    }
  });

  return { cache, setCache, resetCache };
}
