import { useGameMeta } from './useGameMeta';
import { useGlobalState } from './useGlobalState';

/**
 * Determine is user is the Host by checking if they were the one who created the game.
 * @returns Returns true if the user is the Host, false otherwise
 */
export function useHost(): boolean {
  const { createdBy } = useGameMeta();
  const [userId] = useGlobalState('userId');

  return createdBy === userId;
}
