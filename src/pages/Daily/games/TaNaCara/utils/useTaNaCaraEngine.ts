import { cloneDeep, sampleSize } from 'lodash';
import { useEffect } from 'react';
// Services
import { logAnalyticsEvent } from '@services/firebase';
// Pages
import { useDailyGameState, useDailySessionState } from '@pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from '@pages/Daily/hooks/useDailyLocalToday';
import { useMarkAsPlayed } from '@pages/Daily/hooks/useDailyPlayTracker';
import { usePreference } from '@pages/Daily/hooks/useDailyPreferences';
import { useDailySaveTestimonies } from '@pages/Daily/hooks/useDailySave';
import { getAnalyticsEventName } from '@pages/Daily/utils';
import { playSFX } from '@pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { AnswerToSave, DailyTaNaCaraEntry, GameState, SessionState } from './types';

export function useTaNaCaraEngine(data: DailyTaNaCaraEntry, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);

  const [mode, setMode] = usePreference('taNaCaraMode');

  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    questionIndex: 0,
    testimonies: data.testimonies.filter((t) => (mode !== 'nsfw' ? !t.nsfw : true)),
    suspectsIds: data.testimonies.map((t) => {
      // Get suspects from the testimony
      const suspects: string[] = sampleSize(t.suspectsIds || [], 5);
      // If empty or not enough, use suspects from day
      const dataSuspects = data.suspectsIds.filter((id) => !suspects.includes(id));
      if (suspects.length < 6) {
        suspects.push(...sampleSize(dataSuspects, 6 - suspects.length));
      }
      return suspects;
    }),
    answers: [
      {
        testimonyId: data.testimonies[0].testimonyId,
        answers: {},
      },
    ],
    selections: [],
    mode: 'nsfw',
    screen: 'idle',
    variant: data.variant || 'gb', // Default to 'gb' if not provided
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
  const currentAnswers = session.answers[session.questionIndex];
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
          answers: {},
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

  const onUpdateAnswer = (suspectId: string, answer: boolean | null) => {
    if (answer === null) {
      playSFX('select');
    } else {
      playSFX(answer ? 'yah' : 'nah');
    }

    setSession((prev) => {
      const copy = cloneDeep(prev);
      const currentAnswers = copy.answers[copy.questionIndex];

      if (currentAnswers) {
        copy.answers[copy.questionIndex].answers[suspectId] = answer;
      }

      return copy;
    });
  };

  const onComplete = () => {
    // Parse answers into AnswersToSave format
    const result: AnswerToSave[] = session.answers.map((answer) => {
      return {
        testimonyId: answer.testimonyId,
        related: Object.entries(answer.answers)
          .filter(([, value]) => value === true)
          .map(([key]) => removeStyleMidFix(key)),
        unrelated: Object.entries(answer.answers)
          .filter(([, value]) => value === false)
          .map(([key]) => removeStyleMidFix(key)),
      };
    });

    mutation.mutate(result);
  };

  const mutation = useDailySaveTestimonies(() => {
    updateState({ played: true });
    updateSession({ screen: 'idle' });
    logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'played'));
  });

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete: state.played,
  });

  const allSuspects = [...(data?.suspectsIds || []), ...data.testimonies.flatMap((t) => t.suspectsIds || [])];

  const onChangeVariant = (variant: string) => updateSession({ variant });

  return {
    questionIndex: session.questionIndex,
    questionNumber: session.questionIndex + 1,
    questionSuspects: session.suspectsIds[session.questionIndex],
    question,
    currentAnswers,
    suspects,
    totalQuestions: session.testimonies.length,
    isPlaying: session.screen === 'playing',
    isIdle: session.screen === 'idle',
    isSaving: session.screen === 'saving' || mutation.isPending,
    alreadyPlayed: state.played,
    variant: session.variant,
    mode,
    onToggleAllowNSFW,
    onStart,
    onNext,
    onPrevious,
    onComplete,
    onUpdateAnswer,
    onChangeVariant,
    allSuspects,
  };
}

const removeStyleMidFix = (id: string) => {
  const parts = id.split('-');
  return parts.length > 2 ? [parts[0], parts[2]].join('-') : id;
};
