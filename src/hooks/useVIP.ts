import { useGameMeta } from './useGameMeta';
import { useGlobalState } from './useGlobalState';

/**
 * Determine is user is the VIP by checking if they were the one who created the game.
 * @returns Returns true if the user is the VIP, false otherwise
 */
export function useVIP(): boolean {
  const { createdBy } = useGameMeta();
  const [userId] = useGlobalState('userId');

  return createdBy === userId;
}
