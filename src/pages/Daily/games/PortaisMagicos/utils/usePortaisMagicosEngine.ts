import { cloneDeep } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Internal
import type { DailyPortaisMagicosEntry, GameState } from './types';
import { SETTINGS } from './settings';

export function usePortaisMagicosEngine(data: DailyPortaisMagicosEntry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateState({
      currentCorridorIndexes: data.corridors[state.currentCorridorIndex].words.map(() => 1),
    });
  }, [state.currentCorridorIndex]);

  // ACTIONS
  const onSlideWordPosition = (index: number) => {
    setState(() => {
      const copy = cloneDeep(state);
      // If it reaches the last index, it should go back to 0;
      const wordsLength = data.corridors[copy.currentCorridorIndex].words[0].length;

      const targetPosition =
        copy.currentCorridorIndexes[index] >= wordsLength - 1 ? 0 : copy.currentCorridorIndexes[index] + 1;
      copy.currentCorridorIndexes[index] = targetPosition;
      copy.moves += 1;

      return copy;
    });
    playSFX('swap');
  };

  const onSubmitPasscode = () => {
    setState((prev) => {
      const copy = cloneDeep(prev);
      const wordsLength = data.corridors[copy.currentCorridorIndex].words[0].length;
      const passcode = data.corridors[copy.currentCorridorIndex].passcode;

      const newGuess = copy.currentCorridorIndexes
        .map((pos, index) => data.corridors[copy.currentCorridorIndex].words[index][wordsLength - 1 - pos])
        .join('');

      copy.guesses[copy.currentCorridorIndex].push(newGuess);

      const isCorrect = newGuess === passcode;

      if (isCorrect) {
        copy.currentCorridorIndex += 1;
        message.success({
          content: translate(`Você acertou: ${passcode.toUpperCase()}!`, `Correct: ${passcode}`),
          duration: 3,
        });
        playSFX(copy.currentCorridorIndex === data.corridors.length ? 'win' : 'sparks');
      } else {
        copy.hearts -= 1;
        message.warning({
          content: translate('Palavra-chave incorreta. Tente novamente!', 'Incorrect passcode. Try again!'),
          duration: 3,
        });
        playSFX(copy.hearts <= 0 ? 'lose' : 'wrong');
      }

      if (isCorrect && copy.currentCorridorIndex === data.corridors.length) {
        copy.status = STATUSES.WIN;
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
        copy.currentCorridorIndex = 2;
      }

      if (copy.hearts <= 0) {
        copy.status = STATUSES.LOSE;
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
      }

      return copy;
    });
  };

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
    currentCorridorIndex: state.currentCorridorIndex,
    currentCorridor: data.corridors[state.currentCorridorIndex],
    currentCorridorIndexes: state.currentCorridorIndexes,
    moves: state.moves,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onSlideWordPosition,
    onSubmitPasscode,
  };
}
