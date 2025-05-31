import { cloneDeep, sampleSize } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useDailySaveTestimonies } from 'pages/Daily/hooks/useDailySave';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
// Internal
import { SETTINGS } from './settings';
import type { DailyTaNaCaraEntry, GameState, SessionState } from './types';

export function useTaNaCaraEngine(data: DailyTaNaCaraEntry, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);

  const [mode, setMode] = useLocalStorage(SETTINGS.TD_DAILY_TA_NA_CARA_MODE, 'normal');

  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    questionIndex: 0,
    testimonies: data.testimonies.filter((t) => (mode !== 'nsfw' ? !t.nsfw : true)),
    suspectsIds: data.testimonies.map((t) => {
      // Get suspects from the testimony
      const suspects: string[] = sampleSize(t.suspectsIds || [], 6);
      // If empty or not enough, use suspects from day
      if (suspects.length < 6) {
        suspects.push(...sampleSize(data.suspectsIds, 6 - suspects.length));
      }
      return suspects;
    }),
    answers: [
      {
        testimonyId: data.testimonies[0].testimonyId,
        related: [],
        unrelated: [],
      },
    ],
    selections: [],
    mode: 'nsfw',
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
      mode: checked ? 'nsfw' : 'normal',
      testimonies: data.testimonies.filter((t) => (checked ? true : !t.nsfw)),
    });
    setMode(checked ? 'nsfw' : 'normal');
  };

  const question = data.testimonies[session.questionIndex];
  const answer = session.answers[session.questionIndex];
  const suspects = session.suspectsIds[session.questionIndex];

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
          unrelated: [],
        });
      }
      // Update unrelated for the previous question
      if (copy.answers[copy.questionIndex]) {
        copy.answers[copy.questionIndex].unrelated = suspects.filter(
          (suspectId) => !copy.answers[copy.questionIndex].related.includes(suspectId),
        );
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
    playSFX(isRelated ? 'yah' : 'nah');
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
    // Update unrelated for the current question
    if (session.answers[session.questionIndex]) {
      session.answers[session.questionIndex].unrelated = suspects.filter(
        (suspectId) => !session.answers[session.questionIndex].related.includes(suspectId),
      );
    }

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

  const allSuspects = [...(data?.suspectsIds || []), ...data.testimonies.flatMap((t) => t.suspectsIds || [])];

  return {
    questionIndex: session.questionIndex,
    questionNumber: session.questionIndex + 1,
    questionSuspects: session.suspectsIds[session.questionIndex],
    question,
    answer,
    suspects,
    totalQuestions: session.testimonies.length,
    isPlaying: session.screen === 'playing',
    isIdle: session.screen === 'idle',
    isSaving: session.screen === 'saving' || mutation.isPending,
    alreadyPlayed: state.played,
    mode,
    onToggleAllowNSFW,
    onStart,
    onNext,
    onPrevious,
    onComplete,
    onUpdateAnswer,
    allSuspects,
  };
}
