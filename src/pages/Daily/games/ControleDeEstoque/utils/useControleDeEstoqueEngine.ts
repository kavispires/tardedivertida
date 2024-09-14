import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { deepCopy } from 'utils/helpers';

import { DEFAULT_LOCAL_TODAY, getGuessString, getInitialState, validateAttempts } from './helpers';
import { PHASES, SETTINGS } from './settings';
import { ControleDeEstoqueLocalToday, DailyControleDeEstoqueEntry, GameState } from './types';

export function useControleDeEstoqueEngine(data: DailyControleDeEstoqueEntry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const currentGood: string | undefined = data.goods[state.warehouse.filter(Boolean).length];

  const { updateLocalStorage } = useDailyLocalToday<ControleDeEstoqueLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });

  /**
   * Places a good in the warehouse
   */
  const onPlaceGood = (shelfIndex: number) => {
    if (shelfIndex >= 0 && currentGood) {
      setState((prev) => {
        const copy = deepCopy(prev);

        copy.warehouse[shelfIndex] = currentGood;
        copy.lastPlacedGoodId = currentGood;

        if (copy.warehouse.every(Boolean)) {
          copy.phase = PHASES.FULFILLING;

          updateLocalStorage({ warehouse: copy.warehouse as string[] });
        }

        return copy;
      });
    }
  };

  /**
   * Selects an order to fulfill
   */
  const onSelectOrder = (order: string) => {
    updateState({ activeOrder: order });
  };

  /**
   * Fulfills an order
   * (assigns an order to a shelf)
   */
  const onFulfill = (shelfIndex: number) => {
    setState((prev) => {
      const copy = deepCopy(prev);
      copy.fulfillments.push({ order: state.activeOrder!, shelfIndex: shelfIndex });
      copy.activeOrder = null;
      return copy;
    });
  };

  /**
   * Takes back an order from a shelf
   */
  const onTakeBack = (orderId: string) => {
    setState((prev) => {
      const copy = deepCopy(prev);
      copy.fulfillments = copy.fulfillments.filter((fulfillment) => fulfillment.order !== orderId);
      copy.activeOrder = orderId;
      return copy;
    });
  };

  /**
   * Attempt to deliver the orders
   * The order placements must match where the products are in the warehouse
   */
  const onSubmit = () => {
    const newGuessString = getGuessString(state.fulfillments);

    if (state.guesses.includes(newGuessString)) {
      message.warning({
        content: translate(
          'Você já tentou essa combinação. Tente outra!',
          'You already tried this combination. Try another one!'
        ),
        duration: 5,
      });

      return updateState({
        latestAttempt: Date.now(),
      });
    }

    updateLocalStorage({
      guesses: [...state.guesses, newGuessString],
      warehouse: state.warehouse as string[],
    });

    const attemptResult = validateAttempts(state.warehouse, state.fulfillments);

    const isAllCorrect = attemptResult.every(Boolean);

    message.warning({
      content: translate(
        'Um ou mais produtos estão fora de lugar. Tente novamente!',
        'One or more products are out of place. Try again!'
      ),
      duration: 3,
    });

    setState((prev) => {
      const copy = deepCopy(prev);
      copy.latestAttempt = Date.now();
      copy.evaluations.push(attemptResult);
      copy.guesses.push(newGuessString);

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

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  const reset = () => {
    updateLocalStorage({
      warehouse: Array(data.goods.length).fill(null),
      guesses: [],
      extraAttempts: state.extraAttempts + 1,
    });
    const resetState = getInitialState(data, true);
    setState({
      ...resetState,
      extraAttempts: state.extraAttempts + 1,
      hearts: SETTINGS.HEARTS - state.extraAttempts - 1,
    });
  };

  return {
    hearts: state.hearts,
    phase: state.phase,
    warehouse: state.warehouse,
    fulfillments: state.fulfillments,
    lastPlacedGoodId: state.lastPlacedGoodId,
    guesses: state.guesses,
    evaluations: state.evaluations,
    latestAttempt: state.latestAttempt,
    orders: data.orders,
    currentGood,
    activeOrder: state.activeOrder,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onPlaceGood,
    onSelectOrder,
    onFulfill,
    onTakeBack,
    onSubmit,
    reset,
  };
}
