import { useLocalStorage } from 'hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { ArteRuimLocalToday, DailyArteRuimEntry } from '../games/ArteRuim/utils/types';

/**
 * Keeps local storage updated so that the user can continue where they left off
 * @param source
 * @param game
 * @returns
 */

export function useDailyLocalStorage(source: string, game: DailyArteRuimEntry) {
  const [getLocalProperty, setLocalProperty] = useLocalStorage();

  const [localToday, setLocalToday] = useState<ArteRuimLocalToday>({
    hearts: 3,
    id: game.id,
    letters: [],
    number: 0,
    victory: false,
  });

  useEffect(() => {
    const previousLocalToday = getLocalProperty(source);
    if (previousLocalToday && previousLocalToday.id === game.id) {
      setLocalToday(previousLocalToday);
      return;
    }
  }, [getLocalProperty, source, game]);

  const updateLocalStorage = (value: any) => {
    setLocalProperty({ [source]: value });
    setLocalToday(value);
  };

  return {
    localToday,
    updateLocalStorage,
  };
}

// TD_DAILY_ARTE_RUIM
// TD_DAILY_AQUI_O
// TD_DAILY_QUARTETO
// TD_DAILY_PALAVREADO
export function useNewDailyLocalStorage() {}
