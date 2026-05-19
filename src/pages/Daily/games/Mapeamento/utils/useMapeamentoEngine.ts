import { useEffect, useMemo } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Utils
import { stringRemoveAccents } from 'utils/helpers';
// Pages
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { DailyMapeamentoEntry, GameState } from './types';

export function useMapeamentoEngine(data: DailyMapeamentoEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);
  const { message } = App.useApp();
  const { translate } = useLanguage();

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const locationFragments = useMemo(
    () => getCommonalityFragments(data.location, state.guesses),
    [state.guesses, data.location],
  );

  // ACTIONS
  const submitLocation = (location: string): boolean => {
    // Verify if it's using all words in the locationFragments, if not alert
    const fragmentLettersSet = new Set(locationFragments.join('').replace(/_/g, '').split(''));
    const locationLettersSet = new Set(location.toUpperCase().split(''));
    for (const letter of fragmentLettersSet) {
      if (!locationLettersSet.has(letter)) {
        playSFX('wrong');
        message.warning({
          content: translate({
            pt: 'Sua tentativa deve incluir todas as letras já reveladas nos fragmentos!',
            en: 'Your attempt must include all letters already revealed in the fragments!',
          }),
          duration: 5,
        });

        return false;
      }
    }

    const cleanedLocation = location
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '');
    const cleanedActualLocation = stringRemoveAccents(
      data.location.trim().replace(/\s+/g, ' ').toLowerCase(),
    ).replace(/[^a-z0-9\s]/g, '');

    const isCorrect = cleanedLocation === cleanedActualLocation;

    if (isCorrect) {
      setState((prev) => ({ ...prev, status: STATUSES.WIN }));
      logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
      playSFX('win');
    } else {
      setState((prev) => {
        const newHearts = prev.hearts - 1;
        const isLose = newHearts <= 0;
        if (isLose) {
          logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
          playSFX('lose');
        } else {
          playSFX('no');
        }
        return {
          ...prev,
          hearts: newHearts,
          guesses: [...prev.guesses, location],
          status: isLose ? STATUSES.LOSE : prev.status,
        };
      });
    }

    return true;
  };

  const availableClues = data.clues.slice(0, SETTINGS.HEARTS - state.hearts + 1);

  // CONDITIONS
  const isWin = state.status === STATUSES.WIN;
  const isLose = state.status === STATUSES.LOSE;
  const isComplete = isWin || isLose;

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isWin || isLose || isComplete);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    allClues: data.clues,
    availableClues,
    locationFragments,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    submitLocation,
  };
}

function getCommonalityFragments(location: string, guesses: string[]): string[] {
  // Combine all guesses into a single set.
  // If they guess a multi-word location, the space (' ') gets added to this Set naturally!
  const guessedLetters = new Set(guesses.join('').toUpperCase().split(''));
  const targetLocation = location.toUpperCase();

  const fragments: string[] = [];
  let inGap = false;

  for (let i = 0; i < targetLocation.length; i++) {
    const char = targetLocation[i];

    if (guessedLetters.has(char)) {
      // The player has guessed this character (whether it's a letter OR a space)
      fragments.push(char);
      inGap = false;
    } else {
      // The player hasn't guessed this character yet
      if (!inGap) {
        fragments.push('_');
        inGap = true;
      }
    }
  }

  return fragments;
}
