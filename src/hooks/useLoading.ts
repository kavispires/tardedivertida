import { useEffect, useState } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

type InitialState = {
  loaders: PlainObject;
};

const initialState: InitialState = {
  loaders: {},
};

// Keep loading global state consistent even with multiple uses of useLoading
const { useGlobalState: useLoadersState } = createGlobalState(initialState);

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
  const [isLoading, setLoading] = useState(false);
  const [loaders, setLoaders] = useLoadersState('loaders');

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
