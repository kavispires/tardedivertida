import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { format } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'TD_cache';

// biome-ignore lint/suspicious/noExplicitAny: it is needed to have a generic type of the store
type GENERIC_ANY = any;

// Define the shape of our localStorage payload
interface LocalCachePayload<T> {
  gameId: string;
  date: string; // YYYY-MM-DD format for cleanup purposes
  data: T;
}

// Global registry to ensure components requesting the same gameId share the exact same store instance
const storeRegistry = new Map<string, Store<GENERIC_ANY>>();

function getOrCreateStore<T extends object>(gameId: string, defaultValue: T): Store<T> {
  // 1. Return the existing store if it's already running in memory
  if (storeRegistry.has(gameId)) {
    return storeRegistry.get(gameId) as Store<T>;
  }

  // 2. Attempt to load from localStorage
  let initialState: T = defaultValue;
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as LocalCachePayload<T>;
        // Only use the cache if the gameId matches what we are trying to load
        if (parsed.gameId === gameId) {
          initialState = parsed.data;
        }
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: for debugging purposes
      console.error('Failed to parse TD_cache from localStorage', error);
    }
  }

  // 3. Initialize the TanStack Store
  const store = new Store<T>(initialState);

  // 4. Subscribe to any state changes to automatically sync with localStorage
  store.subscribe(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ gameId, date: format(new Date(), 'yyyy-MM-dd'), data: store.state }),
      );
    }
  });

  // 5. Cache the store instance and return it
  storeRegistry.set(gameId, store);
  return store;
}

/**
 * A persistent cache hook that synchronizes state with localStorage and shares stores across components.
 *
 * This hook creates a TanStack Store instance that is:
 * - Scoped to the current game session (via gameId from URL params)
 * - Automatically persisted to localStorage on every state change
 * - Shared across all components that use the same gameId (singleton pattern)
 * - Restored from localStorage when the component mounts (if gameId matches)
 *
 * The hook provides three update methods:
 * - `setCache`: Replaces the entire cache state (like React's setState)
 * - `updateCache`: Updates a single property using a path (supports nested paths via lodash)
 * - `resetCache`: Restores the cache to the original defaultValue
 *
 * @template T - The shape of the cached data object
 * @param defaultValue - The initial/default state structure for the cache
 * @returns An object containing the current cache state and methods to update it
 */
export function useCacheV2<T extends object>(defaultValue: T) {
  const params = useParams();
  const gameId = params['*'] || '';
  const store = getOrCreateStore<T>(gameId, defaultValue);
  const state = useSelector(store, (state) => state);

  // setCache: Replaces entire state. Acts like React's setState (accepts value or callback)
  const setCache = useCallback(
    (updater: T | ((prev: T) => T)) => {
      store.setState((prev) => {
        if (typeof updater === 'function') {
          const updateFn = updater as (prev: T) => T;
          return updateFn(prev);
        }
        return updater;
      });
    },
    [store],
  );

  // resetCache: Restores state back to the original defaultValue passed to the hook
  const resetCache = useCallback(() => {
    store.setState(() => defaultValue);
  }, [store, defaultValue]);

  // update: Updates a single value. Uses lodash to safely mutate a clone, supporting nested paths!
  const updateCache = useCallback(
    (path: string | keyof T, value: GENERIC_ANY) => {
      store.setState((prev) => {
        const nextState = cloneDeep(prev);
        set(nextState, path as string, value);
        return nextState;
      });
    },
    [store],
  );

  return {
    cache: state,
    setCache,
    resetCache,
    updateCache,
  };
}
