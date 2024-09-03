import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { deepCopy } from 'utils/helpers';

import { parseLocalToday } from './helpers';
import { SETTINGS } from './settings';
import { DailyTeoriaDeConjuntosEntry, GameState, Guess, TeoriaDeConjuntosLocalToday, TThing } from './types';

const defaultLocalToday: TeoriaDeConjuntosLocalToday = {
  guesses: [],
  hearts: SETTINGS.HEARTS,
};

const getInitialState = (data: DailyTeoriaDeConjuntosEntry): GameState => {
  return {
    hearts: SETTINGS.HEARTS,
    win: false,
    hand: data.things.slice(0, 4),
    deck: data.things.slice(4),
    rule1Things: [
      {
        id: data.rule1.thing.id,
        name: data.rule1.thing.name,
        rule: 1,
      },
    ],
    rule2Things: [
      {
        id: data.rule2.thing.id,
        name: data.rule2.thing.name,
        rule: 2,
      },
    ],
    intersectingThings: [
      {
        id: data.intersectingThing.id,
        name: data.intersectingThing.name,
      },
    ],
    activeThing: null,
    activeArea: null,
    guesses: [],
  };
};

export function useTeoriaDeConjuntosEngine(data: DailyTeoriaDeConjuntosEntry) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(getInitialState(data));

  // CONDITIONS
  const isWin = state.win;
  const isLose = state.hearts <= 0;
  const isComplete = isWin || isLose;

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  const { updateLocalStorage } = useDailyLocalToday<TeoriaDeConjuntosLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultLocalToday,
    onApplyLocalState: (value) => {
      if (value.guesses.length > 0) {
        setState((prevState) => {
          const copy = deepCopy(prevState);

          return parseLocalToday(value, data, copy);
        });
      }
    },
  });

  const onSelectThing = (thing: TThing) => {
    updateState({ activeThing: thing });
  };

  const onSelectArea = (area: number | null) => {
    if (!state.activeThing) return;

    updateState({ activeArea: area });
  };

  const onConfirmPlacement = () => {
    if (!state.activeThing && state.activeArea === null) return;

    let isCorrect = false;
    if (state.activeThing?.rule === state.activeArea) {
      isCorrect = true;
      message.success({
        content: translate('Correto!', 'Correct!'),
      });
    } else {
      isCorrect = false;
      message.error({
        content: translate('Incorreto!', 'Incorrect!'),
      });
    }

    let localStateUpdate = state.guesses;
    let localStateUpdateHearts = state.hearts;

    setState((prevState) => {
      const copy = deepCopy(prevState);

      if (state.activeThing) {
        // Remove thing from hand
        copy.hand = copy.hand.filter((thing) => thing.id !== state.activeThing?.id);

        let guess: Guess = {
          thingId: state.activeThing.id,
          sectionId: state.activeArea!,
          result: state.activeArea!,
        };

        // Add to the appropriate area
        if (state.activeThing.rule === 1) {
          copy.rule1Things.push(state.activeThing!);
        } else if (state.activeThing.rule === 2) {
          copy.rule2Things.push(state.activeThing!);
        } else if (state.activeThing.rule === 0) {
          copy.intersectingThings.push(state.activeThing!);
        }

        // If incorrect, add from the deck and lose a heart
        if (!isCorrect) {
          guess.result = false;
          copy.hearts -= 1;
          localStateUpdateHearts -= 1;
          if (copy.deck.length > 0) {
            copy.hand.push(copy.deck.pop()!);
          }
        }

        // Add guess
        copy.guesses.push(guess);
        localStateUpdate = deepCopy(copy.guesses);

        // Remove active things
        copy.activeThing = null;
        copy.activeArea = null;

        // Check if all things are placed and update win state
        if (copy.hand.length === 0) {
          copy.win = true;
        }
      }

      return copy;
    });

    // Update local today
    updateLocalStorage({
      guesses: localStateUpdate,
      hearts: localStateUpdateHearts,
    });
  };

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
    activeThing: state.activeThing,
    activeArea: state.activeArea,
    guesses: state.guesses,
    onSelectThing,
    onSelectArea,
    onConfirmPlacement,
  };
}
