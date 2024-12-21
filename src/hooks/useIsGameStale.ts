import { useEffect, useState } from "react";

/**
 * Check if game is too old
 * @param gameCreatedAt
 * @returns
 */
export function useIsGameStale(gameCreatedAt: DateMilliseconds): boolean {
  const [isGameStale, setGameStale] = useState(false);

  useEffect(() => {
    setGameStale(Date.now() - 24 * 60 * 60 * 1000 > gameCreatedAt);
  }, [gameCreatedAt]);

  return isGameStale;
}
