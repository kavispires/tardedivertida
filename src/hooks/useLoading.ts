import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

let globalLoadingState: LoadingState = {};
let listeners: Array<(state: LoadingState) => void> = [];

const setGlobalLoadingState = (newState: LoadingState) => {
  globalLoadingState = { ...globalLoadingState, ...newState };
  listeners.forEach((listener) => listener(globalLoadingState));
};

/**
 * Global hook to manage loading state.
 * @returns An object containing:
 * - `isLoading` {boolean}: A boolean indicating if any loading state is true.
 * - `setLoader` {Function}: A function to set the loading state for a specific key.
 * - `isKeyLoading` {Function}: A function to check if a specific key is loading.
 */
export const useLoading = () => {
  const [loadingState, setLoadingState] = useState(globalLoadingState);

  const setLoader = useCallback((key: string, isLoading: boolean) => {
    setGlobalLoadingState({ [key]: isLoading });
  }, []);

  const isLoading = Object.values(loadingState).some((value) => value);

  const isKeyLoading = (key: string) => !!loadingState[key];

  const listener = useCallback((state: LoadingState) => {
    setLoadingState(state);
  }, []);

  // Subscribe to changes
  useState(() => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  });

  return { isLoading, setLoader, isKeyLoading };
};
