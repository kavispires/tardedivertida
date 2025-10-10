import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';

const KEY = 'TD_STORE';

type StoreCache<T extends Record<string, any>> = {
  [key: string]: {
    gameId: GameId;
    timestamp: number;
    data: T;
  };
};

export const getStoreKey = (gameName?: string) => `${KEY}-${gameName ?? localStorage.getItem('TD_gameName')}`;

/**
 * Retrieves the initial game state from localStorage or returns a default state.
 *
 * This function attempts to fetch the saved state from localStorage using a predefined key.
 * If a saved state exists and its gameId matches the provided gameId parameter,
 * it returns a deep clone of the saved state. Otherwise, it returns a deep clone of the default
 * initial state.
 *
 * @param gameId - The current game ID to check against localStorage
 * @param defaultData - The default data to use if no cached data exists
 * @returns A deep clone of either the saved state or the default initial state
 */
const getInitialState = <T extends Record<string, unknown>>(gameId?: GameId, defaultData?: T) => {
  const key = getStoreKey();
  try {
    const savedState = localStorage.getItem(key);
    if (savedState && gameId) {
      const parsedState = JSON.parse(savedState);
      const localStorageGameId = parsedState.gameId;

      if (localStorageGameId === gameId) {
        return cloneDeep({
          [key]: parsedState,
        });
      }
    }
  } catch (_) {
    // Silently fail and return the initial state
  }

  return cloneDeep({
    [key]: {
      gameId: gameId || '',
      timestamp: Date.now(),
      data: defaultData || {},
    },
  });
};

// Create a store with the default initial state
const storeCache = new Store<StoreCache<any>>({});

/**
 * Hook for using the store cache in a game
 * @param gameId - The ID of the game to work with
 * @param defaultData - The default data to use if no cached data exists
 */
export const useStoreCache = <I extends Record<string, unknown> = Record<string, unknown>>(
  gameId: GameId,
  defaultData: I = {} as I,
) => {
  const key = getStoreKey();

  // Initialize the store with the correct gameId on component mount
  useEffect(() => {
    // Initialize store with data from localStorage if it exists
    const cachedState = getInitialState(gameId, defaultData);
    storeCache.setState(cachedState);
  }, [gameId, defaultData]);

  const state = useStore(storeCache);

  return {
    state: state[key],
  };
};
