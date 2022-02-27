import { useEffect } from 'react';

import { useGlobalState } from './index';

type UseLoading = {
  isLoading: boolean;
  setLoader: (key: string, value: boolean) => void;
  loaders: BooleanDictionary;
};

/**
 * Aggregate loading states into a single object, and single isLoading state
 * @returns
 */
export function useLoading(): UseLoading {
  const [isLoading, setLoading] = useGlobalState('isLoading');
  const [loaders, setLoaders] = useGlobalState('loaders');

  useEffect(() => {
    setLoading(Object.values(loaders).some((v) => v));
  }, [loaders, setLoading]);

  const setLoader = (key: string, value: boolean) => {
    setLoaders((values) => ({
      ...values,
      [key]: value,
    }));
  };

  return { isLoading, setLoader, loaders };
}
