import { useEffectOnce } from 'react-use';

import { useGlobalLocalStorage } from './useGlobalLocalStorage';

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
  const [cache, setLSCache] = useGlobalLocalStorage('cache');

  const resetCache = () => {
    setLSCache({});
  };

  useEffectOnce(() => {
    if (options?.clearCache) {
      resetCache();
    }
  });

  const setCache = (
    value: Record<string, any> | ((prevCache: Record<string, any>) => Record<string, any>)
  ) => {
    const currentCache = cache;
    const newCache = typeof value === 'function' ? value(currentCache) : value;
    setLSCache(newCache);
  };

  return { cache, setCache, resetCache };
}
