import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';

const KEY = 'TD_STORE-ta-na-cara';

type TaNaCaraStore = {
  [KEY]: {
    gameId: GameId;
    timestamp: number;
    data: Record<
      string,
      {
        identityId: string;
        eliminated: BooleanDictionary;
      }
    >;
  };
};

const initialState = {
  [KEY]: {
    gameId: '',
    timestamp: Date.now(),
    data: {},
  },
};

/**
 * Retrieves the initial game state from localStorage or returns a default state.
 *
 * This function attempts to fetch the saved state from localStorage using a predefined KEY.
 * If a saved state exists and its gameId matches the provided gameId parameter,
 * it returns a deep clone of the saved state. Otherwise, it returns a deep clone of the default
 * initial state.
 *
 * @param gameId - The current game ID to check against localStorage
 * @returns A deep clone of either the saved state or the default initial state
 */
const getInitialState = (gameId?: GameId) => {
  try {
    const savedState = localStorage.getItem(KEY);
    if (savedState && gameId) {
      const parsedState = JSON.parse(savedState);
      const localStorageGameId = parsedState.gameId;

      if (localStorageGameId === gameId) {
        return cloneDeep({
          [KEY]: parsedState,
        });
      }
    }
  } catch (_) {
    // Silently fail and return the initial state
  }

  return cloneDeep(initialState);
};

// Create a store with the default initial state
const taNaCaraGameStore = new Store<TaNaCaraStore>(initialState);

// Remove debug logs

/**
 * Hook for using the Ta Na Cara game store
 * @param gameId - The ID of the game to work with
 */
export const useTaNaCaraStore = (gameId: GameId) => {
  // Initialize the store with the correct gameId on component mount
  useEffect(() => {
    // Initialize store with data from localStorage if it exists
    const initialState = getInitialState(gameId);
    taNaCaraGameStore.setState(initialState);
  }, [gameId]);

  const state = useStore(taNaCaraGameStore);

  /**
   * Updates the player state in the store using the provided gameId from the hook
   */
  const updatePlayerState = (playerId: PlayerId, identityId: string, partialState: BooleanDictionary) => {
    // Get current state
    const currentState = taNaCaraGameStore.state;
    const currentGameKey = currentState[KEY];

    // If game ID is different, reset the store
    if (currentGameKey.gameId !== gameId) {
      const newState = cloneDeep(initialState);
      newState[KEY].gameId = gameId;
      newState[KEY].timestamp = Date.now();
      newState[KEY].data = {
        [playerId]: {
          identityId,
          eliminated: partialState ?? {},
        },
      };

      // Update store and save to localStorage
      taNaCaraGameStore.setState(newState);
      localStorage.setItem(KEY, JSON.stringify(newState[KEY]));
      return;
    }

    // Check if player exists and if identity matches
    const playerState = currentGameKey.data[playerId];

    // Create updated state
    const newState = cloneDeep(currentState);

    if (!playerState || playerState.identityId !== identityId) {
      // Player doesn't exist or identity changed, create fresh player state
      newState[KEY].data[playerId] = {
        identityId,
        eliminated: partialState ?? {},
      };
    } else {
      // Player exists with same identity, apply partial update
      newState[KEY].data[playerId] = {
        ...playerState,
        eliminated: { ...playerState.eliminated, ...partialState },
      };
    }

    // Update timestamp
    newState[KEY].timestamp = Date.now();

    // Update store and save to localStorage
    taNaCaraGameStore.setState(newState);
    localStorage.setItem(KEY, JSON.stringify(newState[KEY]));
  };

  return {
    state: state[KEY],
    updatePlayerState,
  };
};

// Write function that clears all eliminated identities for an specific player id
export const clearEliminatedIdentities = (playerId: PlayerId) => {
  const currentState = taNaCaraGameStore.state;
  const playerState = currentState[KEY].data[playerId];

  if (playerState) {
    const newState = cloneDeep(currentState);
    newState[KEY].data[playerId] = {
      ...playerState,
      eliminated: {},
    };

    taNaCaraGameStore.setState(newState);
    localStorage.setItem(KEY, JSON.stringify(newState[KEY]));
  }
};
