import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { differenceInDays, format } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import unset from 'lodash/unset';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'TD_cache';
const MAX_CACHE_AGE_DAYS = 2;

// biome-ignore lint/suspicious/noExplicitAny: it is needed to have a generic type of the store
type GENERIC_ANY = any;

/**
 * Represents a single cached game entry
 */
interface CacheEntry<T = GENERIC_ANY> {
  /**
   * The game session ID
   */
  gameId: string;
  /**
   * The date this cache was last updated (YYYY-MM-DD format)
   */
  date: string;
  /**
   * The cached data for this game
   */
  data: T;
}

/**
 * Storage structure for multiple game caches
 */
interface CacheStorage {
  [gameId: string]: CacheEntry;
}

// Global registry to ensure components requesting the same gameId share the exact same store instance
const storeRegistry = new Map<string, Store<GENERIC_ANY>>();

/**
 * Cleanup old cache entries on module load.
 * Removes any cache entries older than MAX_CACHE_AGE_DAYS.
 */
(function cleanupOldCaches() {
  if (typeof window === 'undefined') return;

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) return;

    const storage: CacheStorage = JSON.parse(cached);
    const today = new Date();
    let hasChanges = false;

    Object.keys(storage).forEach((gameId) => {
      const entry = storage[gameId];
      const cacheDate = new Date(entry.date);
      const daysDiff = differenceInDays(today, cacheDate);

      if (daysDiff > MAX_CACHE_AGE_DAYS) {
        delete storage[gameId];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: for debugging purposes
    console.error('Failed to cleanup old caches', error);
  }
})();

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
        const storage: CacheStorage = JSON.parse(cached);
        // Only use the cache if this specific gameId exists
        if (storage[gameId]) {
          initialState = storage[gameId].data as T;
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
      try {
        // Load existing storage
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storage: CacheStorage = cached ? JSON.parse(cached) : {};

        // Update this game's entry
        storage[gameId] = {
          gameId,
          date: format(new Date(), 'yyyy-MM-dd'),
          data: store.state,
        };

        // Save back to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: for debugging purposes
        console.error('Failed to save cache to localStorage', error);
      }
    }
  });

  // 5. Cache the store instance and return it
  storeRegistry.set(gameId, store);
  return store;
}

/**
 * A persistent cache hook that synchronizes state with localStorage and shares stores across components.
 * Version 2 - uses TanStack Store for better performance and reactivity.
 *
 * This hook creates a TanStack Store instance that is:
 * - Scoped to the current game session (via gameId from URL params)
 * - Automatically persisted to localStorage on every state change
 * - Shared across all components that use the same gameId (singleton pattern)
 * - Restored from localStorage when the component mounts (if gameId matches)
 * - Supports multiple games simultaneously (each with its own cache entry)
 * - Auto-cleanup: Caches older than 2 days are automatically removed on module load
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
export function useCache<T extends object>(defaultValue: T) {
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
        if (value === undefined) {
          unset(nextState, path as string);
        } else {
          set(nextState, path as string, value);
        }
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
