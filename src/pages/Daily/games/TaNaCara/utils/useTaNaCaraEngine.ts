import { cloneDeep } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useDailySaveTestimonies } from 'pages/Daily/hooks/useDailySave';
import { useEffect } from 'react';
// Internal
import { SETTINGS } from './settings';
import type { DailyTaNaCaraEntry, GameState, SessionState } from './types';

export function useTaNaCaraEngine(data: DailyTaNaCaraEntry, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);

  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    questionIndex: 0,
    testimonies: data.testimonies.filter((t) => !t.nsfw),
    answers: [
      {
        testimonyId: data.testimonies[0].testimonyId,
        related: [],
        unrelated: [...data.testimonies[0].suspectsIds],
      },
    ],
    selections: [],
    allowNSFW: false,
    screen: 'idle',
  });

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const onToggleAllowNSFW = (checked: boolean) => {
    updateSession({
      allowNSFW: checked,
      testimonies: data.testimonies.filter((t) => (checked ? true : !t.nsfw)),
    });
  };

  const question = data.testimonies[session.questionIndex];
  const answer = session.answers[session.questionIndex];

  const onStart = () => {
    updateSession({ screen: 'playing' });
  };

  const onNext = () => {
    if (session.screen === 'idle') {
      return updateSession({ screen: 'playing' });
    }

    if (session.questionIndex === session.testimonies.length - 1) {
      return onComplete();
    }

    setSession((prev) => {
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
    if (session.questionIndex > 0) {
      return updateSession({ questionIndex: session.questionIndex - 1 });
    }
  };

  const onUpdateAnswer = (suspectId: string, isRelated: boolean) => {
    setSession((prev) => {
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
    mutation.mutate(session.answers);
  };

  const mutation = useDailySaveTestimonies(() => {
    updateState({ played: true });
    updateSession({ screen: 'idle' });
  });

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete: state.played,
  });

  return {
    questionIndex: session.questionIndex,
    questionNumber: session.questionIndex + 1,
    question,
    answer,
    totalQuestions: session.testimonies.length,
    isPlaying: session.screen === 'playing',
    isIdle: session.screen === 'idle',
    isSaving: session.screen === 'saving' || mutation.isPending,
    alreadyPlayed: state.played,
    onToggleAllowNSFW,
    onStart,
    onNext,
    onPrevious,
    onComplete,
    onUpdateAnswer,
  };
}
