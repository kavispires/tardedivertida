import { useEffect, useState } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

type InitialState = {
  errors: StringDictionary;
};

const initialState: InitialState = {
  errors: {},
};

// Keep error global state consistent even with multiple uses of useError
const { useGlobalState: useLoadersState } = createGlobalState(initialState);

type UseError = {
  isError: boolean;
  setError: (key: string, value: string) => void;
  errors: StringDictionary;
};

/**
 * Aggregate error states into a single object, and single isError state
 * @returns
 */
export function useError(): UseError {
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useLoadersState('errors');

  useEffect(() => {
    setIsError(Object.values(errors).some((v) => v));
  }, [errors, setIsError]);

  const setError = (key: string, value: string) => {
    setErrors((values) => ({
      ...values,
      [key]: value,
    }));
  };

  return { isError, setError, errors };
}
