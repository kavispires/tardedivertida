import { useEffect } from 'react';

export function useColorizeBackground(user: GamePlayer, currentRound: number = 0) {
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
