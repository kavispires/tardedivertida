import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { DEFAULT_LOCAL_TODAY } from './helpers';
import { SETTINGS } from './settings';
import { DailyTeoriaDeConjuntosEntry, GameState, Guess, TeoriaDeConjuntosLocalToday, TThing } from './types';

export function useTeoriaDeConjuntosEngine(data: DailyTeoriaDeConjuntosEntry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<TeoriaDeConjuntosLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });

  // CONDITIONS
  const isWin = state.win;
  const isLose = state.hearts <= 0;
  const isComplete = isWin || isLose;

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

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
