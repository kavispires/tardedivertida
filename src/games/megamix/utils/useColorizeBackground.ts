import { useEffect } from 'react';
// Types
import type { GamePlayer } from 'types/player';

export function useColorizeBackground(user: GamePlayer, currentRound = 0) {
  const team = user?.team?.[currentRound - 1];

  // Colorize background
  useEffect(() => {
    if (team) {
      const appElement = document.getElementById('app');
      if (appElement) {
        if (team === 'L') {
          appElement.classList.add('background-sad');
        } else {
          appElement.classList.remove('background-sad');
        }
      }
    }
    return () => {
      const appElement = document.getElementById('app');
      appElement?.classList.remove('background-sad');
    };
  }, [team]);
}
