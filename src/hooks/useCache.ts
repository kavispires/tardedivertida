import { useEffectOnce } from 'react-use';

import { useGlobalLocalStorage } from './useGlobalLocalStorage';

const LS_KEY = 'cache';

type UseCacheProps = {
  /**
   * if true, clears the cache when the hook is loaded
   */
  clearCache?: boolean;
};

/**
 * Saves and loads cache whenever the player uses it
 * @param options
 */
export function useCache(options?: UseCacheProps) {
  const [cache, setLSCache] = useGlobalLocalStorage(LS_KEY);

  const resetCache = () => {
    setLSCache({});
  };

  useEffectOnce(() => {
    if (options?.clearCache) {
      resetCache();
    }
  });

  const setCache = (newCache: PlainObject | ((prevCache: PlainObject) => PlainObject)) => {
    setLSCache((prevCache: PlainObject) => (typeof newCache === 'function' ? newCache(prevCache) : newCache));
  };

  return { cache, setCache, resetCache };
}
