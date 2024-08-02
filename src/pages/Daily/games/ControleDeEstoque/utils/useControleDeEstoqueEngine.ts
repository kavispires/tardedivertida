import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';

import { SETTINGS } from './settings';
import { DailyControleDeEstoqueEntry, ControleDeEstoqueLocalToday } from './types';
import { deepCopy } from 'utils/helpers';
import { useQueryClient } from '@tanstack/react-query';

type GameState = {
  hearts: number;
  phase: string;
  warehouse: (string | null)[];
  fulfillments: { order: string; shelfIndex: number }[];
  lastPlacedGoodId: string | null;
  latestAttempt: number | null;
  win: boolean;
  guesses: boolean[][];
};

const defaultArteRuimLocalToday: ControleDeEstoqueLocalToday = {
  id: '',
  number: 0,
  warehouse: [],
  guesses: [],
};

const getInitialState = (data: DailyControleDeEstoqueEntry): GameState => {
  return {
    hearts: SETTINGS.HEARTS,
    phase: '?',
    warehouse: Array(data.goods.length).fill(null),
    fulfillments: [],
    lastPlacedGoodId: null,
    latestAttempt: null,
    win: false,
    guesses: [],
  };
};

export function useControleDeEstoqueEngine(data: DailyControleDeEstoqueEntry) {
  const { state, setState, updateState } = useDailyGameState<GameState>(getInitialState(data));
  const queryClient = useQueryClient();

  const currentGood: string | undefined = data.goods[state.warehouse.filter(Boolean).length];
  const currentOrder: string | undefined =
    data.orders[currentGood ? data.orders.length : state.fulfillments.length];

  const onPlaceGood = (shelfIndex: number) => {
    setState((prev) => {
      const copy = deepCopy(prev);

      copy.warehouse[shelfIndex] = currentGood;
      copy.lastPlacedGoodId = currentGood;
      return copy;
    });
  };

  const onDeliver = (shelfIndex: number) => {
    setState((prev) => {
      const copy = deepCopy(prev);

      copy.fulfillments.push({ order: currentOrder, shelfIndex: shelfIndex });

      return copy;
    });
  };

  const onBack = () => {
    setState((prev) => {
      const copy = deepCopy(prev);
      copy.fulfillments.pop();
      return copy;
    });
  };

  const onSubmit = () => {
    const attemptResult = state.fulfillments.reduce((acc: boolean[], fulfillment, index) => {
      // If it's out of stock
      if (fulfillment.shelfIndex === -1) {
        const evaluation = !state.warehouse.some((good) => good === fulfillment.order);
        acc.push(evaluation);
        return acc;
      }

      // Any other order, should be placed correctly
      const evaluation = fulfillment.order === state.warehouse[fulfillment.shelfIndex];
      acc.push(evaluation);
      return acc;
    }, []);

    const isAllCorrect = attemptResult.every(Boolean);

    setState((prev) => {
      const copy = deepCopy(prev);
      copy.latestAttempt = Date.now();
      copy.guesses.push(attemptResult);

      if (isAllCorrect) {
        copy.win = true;
      } else {
        copy.hearts -= 1;
      }

      return copy;
    });
  };

  // CONDITIONS
  const isWin = state.win;
  const isLose = state.hearts <= 0;
  const isComplete = isWin || isLose;

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  const reset = () => {
    queryClient.refetchQueries({ queryKey: ['controle-de-estoque-demo'] });
  };

  return {
    hearts: state.hearts,
    warehouse: state.warehouse,
    fulfillments: state.fulfillments,
    lastPlacedGoodId: state.lastPlacedGoodId,
    guesses: state.guesses,
    latestAttempt: state.latestAttempt,
    currentGood,
    currentOrder,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onPlaceGood,
    onDeliver,
    onBack,
    onSubmit,
    reset,
  };
}
