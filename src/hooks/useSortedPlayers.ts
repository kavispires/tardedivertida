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
   * Player ID(s) to move to the front of the sorted list
   */
  prioritizePlayerId?: UID | UID[];
  /**
   * Predicate function to filter players after sorting
   */
  filter?: (player: GamePlayer) => boolean;
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
      filter,
    } = options;

    const sortedPlayers = orderBy(Object.values(players), sortBy, orders);

    if (prioritizePlayerId) {
      const prioritizedIds = Array.isArray(prioritizePlayerId) ? prioritizePlayerId : [prioritizePlayerId];

      const prioritizedIdSet = new Set(prioritizedIds);
      const prioritizedPlayers = prioritizedIds
        .map((id) => sortedPlayers.find((player) => player.id === id))
        .filter((player): player is GamePlayer => Boolean(player));
      const remainingPlayers = sortedPlayers.filter((player) => !prioritizedIdSet.has(player.id));

      sortedPlayers.splice(0, sortedPlayers.length, ...prioritizedPlayers, ...remainingPlayers);
    }

    if (filter) {
      return sortedPlayers.filter(filter);
    }

    return sortedPlayers;
  }, [players, options]);
}
