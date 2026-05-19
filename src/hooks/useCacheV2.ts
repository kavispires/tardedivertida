import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { cache, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'TD_cache';

// Define the shape of our localStorage payload
interface LocalCachePayload<T> {
  gameId: string;
  data: T;
}

// Global registry to ensure components requesting the same gameId share the exact same store instance
const storeRegistry = new Map<string, Store<any>>();

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
      console.error('Failed to parse TD_cache from localStorage', error);
    }
  }

  // 3. Initialize the TanStack Store
  const store = new Store<T>(initialState);

  // 4. Subscribe to any state changes to automatically sync with localStorage
  store.subscribe(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ gameId, data: store.state }));
    }
  });

  // 5. Cache the store instance and return it
  storeRegistry.set(gameId, store);
  return store;
}

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
    (path: string | keyof T, value: any) => {
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
