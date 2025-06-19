import { cloneDeep } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Internal
import { SETTINGS } from './settings';
import type { DailyTeoriaDeConjuntosEntry, GameState, Guess, SessionState, TThing } from './types';

export function useTeoriaDeConjuntosEngine(data: DailyTeoriaDeConjuntosEntry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState } = useDailyGameState<GameState>(initialState);

  const { session, updateSession } = useDailySessionState<SessionState>({
    activeThing: null,
    activeArea: null,
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

  // ACTIONS
  const onSelectThing = (thing: TThing) => {
    playSFX('select');
    updateSession({ activeThing: thing });
  };

  const onSelectArea = (area: number | null) => {
    if (!session.activeThing) return;
    playSFX('swap');
    updateSession({ activeArea: area });
  };

  const onConfirmPlacement = () => {
    if (!session.activeThing && session.activeArea === null) return;

    let isCorrect = false;
    if (session.activeThing?.rule === session.activeArea) {
      isCorrect = true;
      playSFX('correct');
      message.success({
        content: translate('Correto!', 'Correct!'),
      });
    } else {
      isCorrect = false;
      playSFX('wrong');
      vibrate('wrong');
      message.error({
        content: translate('Incorreto!', 'Incorrect!'),
      });
    }

    setState((prevState) => {
      const copy = cloneDeep(prevState);

      if (session.activeThing && session.activeArea !== null) {
        // Remove thing from hand
        copy.hand = copy.hand.filter((thing) => thing.id !== session.activeThing?.id);

        const guess: Guess = {
          thingId: session.activeThing.id,
          sectionId: session.activeArea,
          result: session.activeArea,
        };

        // Add to the appropriate area
        if (session.activeThing.rule === 1) {
          copy.rule1Things.push(session.activeThing);
        } else if (session.activeThing.rule === 2) {
          copy.rule2Things.push(session.activeThing);
        } else if (session.activeThing.rule === 0) {
          copy.intersectingThings.push(session.activeThing);
        }

        // If incorrect, add from the deck and lose a heart
        if (!isCorrect) {
          guess.result = false;
          copy.hearts -= 1;

          if (copy.deck.length > 0) {
            const thing = copy.deck.pop();
            if (thing) {
              copy.hand.push(thing);
            }
          }
          if (copy.hearts === 0) {
            playSFX('lose');
            vibrate('lose');
            copy.status = STATUSES.LOSE;
            logAnalyticsEvent(`daily_${SETTINGS.KEY}_lose`);
          }
        }

        // Add guess
        copy.guesses.push(guess);

        // Remove active things
        updateSession({ activeThing: null, activeArea: null });

        // Check if all things are placed and update win state
        if (copy.hand.length === 0) {
          copy.status = STATUSES.WIN;
          logAnalyticsEvent(`daily_${SETTINGS.KEY}_win`);
          playSFX('win');
        }
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
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  return {
    hearts: state.hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    hand: state.hand,
    rule1Things: state.rule1Things,
    rule2Things: state.rule2Things,
    intersectingThings: state.intersectingThings,
    guesses: state.guesses,
    activeThing: session.activeThing,
    activeArea: session.activeArea,
    onSelectThing,
    onSelectArea,
    onConfirmPlacement,
    isWeekend: state.isWeekend,
  };
}
