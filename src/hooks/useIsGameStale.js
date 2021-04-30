import { useEffect, useState } from 'react';

export function useIsGameStale(gameCreatedAt) {
  const [isGameStale, setGameStale] = useState(false);

  useEffect(() => {
    setGameStale(Date.now() - 24 * 60 * 60 * 1000 > gameCreatedAt);
  }, [gameCreatedAt, setGameStale]);

  return isGameStale;
}
