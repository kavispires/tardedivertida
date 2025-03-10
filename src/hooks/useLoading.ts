import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

type LoadingState = {
  loaders: BooleanDictionary;
};

const loadingStore = new Store<LoadingState>({
  loaders: {},
});

const setLoader = (key: string, isLoading: boolean) => {
  loadingStore.setState((prev) => ({ ...prev, [key]: isLoading }));
};

/**
 * Custom hook to manage loading states.
 * This hook provides a way to manage and track loading states using a store.
 * It allows setting individual loading states by key and checking if any or specific keys are loading.
 * @returns An object containing:
 * - `isLoading` {boolean}: A boolean indicating if any loader is active.
 * - `setLoader` {(key: string, isLoading: boolean) => void}: A function to set the loading state for a specific key.
 * - `isKeyLoading` {(key: string) => boolean}: A function to check if a specific key is loading.
 */
export function useLoading() {
  const { loaders } = useStore(loadingStore, () => loadingStore.state);

  const isLoading = Object.values(loaders).some((value) => value);

  const isKeyLoading = (key: string) => !!loaders[key];

  return { isLoading, setLoader, isKeyLoading };
}
