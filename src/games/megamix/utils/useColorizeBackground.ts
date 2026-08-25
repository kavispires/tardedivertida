import { useEffect } from 'react';
// Types
import type { GamePlayer } from 'types/game';

export function useColorizeBackground(user: GamePlayer, currentRound = 0) {
  const team = user?.team?.[currentRound - 1];

  // Colorize background
  useEffect(() => {
    if (team) {
      const backgroundElement = document.getElementById('session-background-image');
      if (backgroundElement) {
        if (team === 'L') {
          backgroundElement.classList.add('background-image-sad');
        } else {
          backgroundElement.classList.remove('background-image-sad');
        }
      }
    }
    return () => {
      const backgroundElement = document.getElementById('session-background-image');
      backgroundElement?.classList.remove('background-image-sad');
    };
  }, [team]);
}
