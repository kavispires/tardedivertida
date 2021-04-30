import { useEffect } from 'react';

import { useGlobalState } from './index';

/**
 * Aggregate loading states into a single object, and single isLoading state
 * @returns [boolean, function, object]
 */
export function useLoading() {
  const [isLoading, setLoading] = useGlobalState('isLoading');
  const [loaders, setLoaders] = useGlobalState('loaders');

  useEffect(() => {
    setLoading(Object.values(loaders).some((v) => v));
  }, [loaders, setLoading]);

  const setLoader = (key, value) => {
    setLoaders((values) => ({
      ...values,
      [key]: value,
    }));
  };

  return [isLoading, setLoader, loaders];
}
