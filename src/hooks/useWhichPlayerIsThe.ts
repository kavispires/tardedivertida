import { useEffect, useState } from 'react';
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
  propertyName = 'activePlayer',
  state: PlainObject = {},
  players: GamePlayers = {},
): [GamePlayer, boolean] {
  const [userId] = useGlobalState('userId');
  const [activePlayer, setActivePlayer] = useState<GamePlayer>(PLACEHOLDER_PLAYER);
  const [isUser, setIsUser] = useState(false);

  // Determine if user is active as the guesser, the clue giver, the psychic, the storyteller, etc
  useEffect(() => {
    const activePlayer = state?.[propertyName];
    setActivePlayer(players?.[activePlayer] ?? {});
    setIsUser(state?.[propertyName] === userId);
  }, [players, propertyName, state, userId]);

  return [activePlayer, isUser];
}
