import { orderBy, type Many, type ListIteratee } from 'lodash';
import { useMemo } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';

/**
 * Options for customizing player sorting and filtering
 */
type UseSortedPlayersOptions = {
  /**
   * Iteratee(s) to determine sort criteria (property name, function, or array)
   */
  sortBy?: Many<ListIteratee<GamePlayer>>;
  /**
   * Sort order(s) corresponding to sortBy iteratees
   */
  orders?: Many<boolean | 'asc' | 'desc'>;
  /**
   * Player ID to move to the front of the sorted list
   */
  prioritizePlayerId?: UID;
  /**
   * Predicate function to filter players after sorting
   */
  filterBy?: (player: GamePlayer) => boolean;
};

/**
 * Sorts and optionally filters game players with memoization
 * @param players - Dictionary of game players keyed by player ID
 * @param options - Configuration options for sorting and filtering
 * @returns Sorted array of GamePlayer objects
 */
export function useSortedPlayers(players: GamePlayers, options: UseSortedPlayersOptions = {}) {
  return useMemo(() => {
    const {
      sortBy = [(o: GamePlayer) => o.name.toLowerCase()],
      orders = ['asc'],
      prioritizePlayerId,
      filterBy,
    } = options;

    const sortedPlayers = orderBy(Object.values(players), sortBy, orders);

    if (prioritizePlayerId) {
      const userIndex = sortedPlayers.findIndex((player) => player.id === prioritizePlayerId);
      if (userIndex > -1) {
        const userPlayer = sortedPlayers.splice(userIndex, 1)[0];
        sortedPlayers.unshift(userPlayer);
      }
    }

    if (filterBy) {
      return sortedPlayers.filter(filterBy);
    }

    return sortedPlayers;
  }, [players, options]);
}
