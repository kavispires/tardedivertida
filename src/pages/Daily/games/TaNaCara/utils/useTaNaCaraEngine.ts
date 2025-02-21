import { cloneDeep } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useDailySaveTestimonies } from 'pages/Daily/hooks/useDailySave';
// Internal
import { DEFAULT_LOCAL_TODAY } from './helpers';
import { SETTINGS } from './settings';
import type { DailyTaNaCaraEntry, TaNaCaraLocalToday, GameState } from './types';

export function useTaNaCaraEngine(data: DailyTaNaCaraEntry, initialState: GameState) {
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<TaNaCaraLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });

  const onToggleAllowNSFW = (checked: boolean) => {
    updateState({
      allowNSFW: checked,
      testimonies: data.testimonies.filter((t) => (checked ? true : !t.nsfw)),
    });
  };

  const question = data.testimonies[state.questionIndex];
  const answer = state.answers[state.questionIndex];

  const onStart = () => {
    updateState({ screen: 'playing' });
  };

  const onNext = () => {
    if (state.screen === 'idle') {
      return updateState({ screen: 'playing' });
    }

    if (state.questionIndex === state.testimonies.length - 1) {
      return onComplete();
    }

    setState((prev) => {
      const copy = cloneDeep(prev);
      const nextIndex = copy.questionIndex + 1;
      if (copy.answers[nextIndex] === undefined) {
        copy.answers.push({
          testimonyId: data.testimonies[nextIndex].testimonyId,
          related: [],
          unrelated: [...data.testimonies[nextIndex].suspectsIds],
        });
      }
      copy.questionIndex = nextIndex;
      return copy;
    });
  };

  const onPrevious = () => {
    if (state.questionIndex > 0) {
      return updateState({ questionIndex: state.questionIndex - 1 });
    }
  };

  const onUpdateAnswer = (suspectId: string, isRelated: boolean) => {
    setState((prev) => {
      const copy = cloneDeep(prev);
      const currentAnswer = copy.answers[copy.questionIndex];

      if (currentAnswer) {
        copy.answers[copy.questionIndex].related = isRelated
          ? [...currentAnswer.related, suspectId]
          : currentAnswer.related.filter((id) => id !== suspectId);
        copy.answers[copy.questionIndex].unrelated = isRelated
          ? currentAnswer.unrelated.filter((id) => id !== suspectId)
          : [...currentAnswer.unrelated, suspectId];
      }

      return copy;
    });
  };

  const onComplete = () => {
    mutation.mutate(state.answers);
  };

  const mutation = useDailySaveTestimonies(() => {
    updateLocalStorage({ played: true });
    updateState({ played: true, screen: 'idle' });
  });

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete: state.played,
  });

  return {
    questionIndex: state.questionIndex,
    questionNumber: state.questionIndex + 1,
    question,
    answer,
    totalQuestions: state.testimonies.length,
    isPlaying: state.screen === 'playing',
    isIdle: state.screen === 'idle',
    isSaving: state.screen === 'saving' || mutation.isPending,
    alreadyPlayed: state.played,
    onToggleAllowNSFW,
    onStart,
    onNext,
    onPrevious,
    onComplete,
    onUpdateAnswer,
  };
}
