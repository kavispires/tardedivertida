import { get } from 'lodash';
import { useMemo } from 'react';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { PLACEHOLDER_PLAYER } from 'utils/constants';
// Internal
import { useGlobalState } from './useGlobalState';

/**
 * Gets player that is assigned to a property in the state
 * @param propertyName
 * @param state
 * @param players
 * @returns a player instance, a boolean if the player is assigned to given property
 */
export function useWhichPlayerIsThe(
  propertyName = 'activePlayerId',
  state: PlainObject = {},
  players: GamePlayers = {},
): [GamePlayer, boolean] {
  const [userId] = useGlobalState('userId');

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  return useMemo(() => {
    const activePlayerId = get(state, propertyName);
    const player = players?.[activePlayerId] ?? PLACEHOLDER_PLAYER;
    const userIsActive = activePlayerId === userId;
    return [player, userIsActive];
  }, [players, propertyName, state, userId]);
}
