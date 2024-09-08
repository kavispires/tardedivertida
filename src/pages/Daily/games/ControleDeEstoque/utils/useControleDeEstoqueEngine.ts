import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { useEffect } from 'react';
import { SEPARATOR } from 'utils/constants';
import { deepCopy } from 'utils/helpers';

import { PHASES, SETTINGS } from './settings';
import { ControleDeEstoqueLocalToday, DailyControleDeEstoqueEntry, GameState } from './types';

const defaultLocalToday: ControleDeEstoqueLocalToday = {
  id: '',
  number: 0,
  warehouse: [],
  guesses: [],
  extraAttempts: 0,
};

const getInitialState = (data: DailyControleDeEstoqueEntry): GameState => {
  return {
    hearts: SETTINGS.HEARTS,
    phase: PHASES.STOCKING,
    warehouse: Array(data.goods.length).fill(null),
    fulfillments: [],
    lastPlacedGoodId: null,
    latestAttempt: null,
    win: false,
    guesses: [],
    evaluations: [],
    activeOrder: null,
    extraAttempts: 0,
  };
};

export function useControleDeEstoqueEngine(data: DailyControleDeEstoqueEntry) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(getInitialState(data));

  const currentGood: string | undefined = data.goods[state.warehouse.filter(Boolean).length];

  const { updateLocalStorage } = useDailyLocalToday<ControleDeEstoqueLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultLocalToday,
    onApplyLocalState: (value) => {
      if (value.warehouse.length || value.extraAttempts) {
        updateState(parseLocalStorage(value, data.goods.length));
      }
    },
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

  useEffect(() => {
    console.log('isComplete', isComplete);
    if (isComplete) {
      updateLocalStorage({
        status: 'played',
      });
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  const reset = () => {
    updateLocalStorage({
      warehouse: Array(data.goods.length).fill(null),
      guesses: [],
      extraAttempts: state.extraAttempts + 1,
    });
    const resetState = getInitialState(data);
    setState({
      ...resetState,
      extraAttempts: state.extraAttempts + 1,
      hearts: SETTINGS.HEARTS - state.extraAttempts - 1,
    });
  };

  // DEV
  // useEffect(() => {
  //   updateState({ warehouse: [...data.goods], phase: PHASES.FULFILLING });
  // }, [data.goods]);

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

const validateAttempts = (warehouse: GameState['warehouse'], fulfillments: GameState['fulfillments']) => {
  return fulfillments.reduce((acc: boolean[], fulfillment) => {
    // If it's out of stock
    if (fulfillment.shelfIndex === -1) {
      const evaluation = !warehouse.some((good) => good === fulfillment.order);
      acc.push(evaluation);
      return acc;
    }

    // Any other order, should be placed correctly
    const evaluation = fulfillment.order === warehouse[fulfillment.shelfIndex];
    acc.push(evaluation);
    return acc;
  }, []);
};

const getGuessString = (fulfillments: GameState['fulfillments']) => {
  return fulfillments.map((f) => `${f.order}${SEPARATOR}${f.shelfIndex}`).join(',');
};

const parseGuessString = (guessString: string) => {
  return guessString.split(',').map((g) => {
    const [order, shelfIndex] = g.split(SEPARATOR);
    return { order, shelfIndex: Number(shelfIndex) };
  });
};

const parseLocalStorage = (value: ControleDeEstoqueLocalToday, goodsQuantity: number) => {
  // Update phase
  const warehouse = value.warehouse.length > 0 ? value.warehouse : Array(goodsQuantity).fill(null);
  const phase = warehouse.every(Boolean) ? PHASES.FULFILLING : PHASES.STOCKING;
  const guesses = value.warehouse.length > 0 ? value.guesses ?? [] : [];
  const extraAttempts = value.extraAttempts ?? 0;
  // Activate the last order attempt
  const fulfillments = guesses.length > 0 ? parseGuessString(guesses[guesses.length - 1]) : [];
  // Determine win
  const attempts = validateAttempts(warehouse, fulfillments);

  const win = attempts.length > 0 && attempts.every(Boolean);

  return {
    phase,
    warehouse,
    guesses,
    evaluations: guesses.map((g) => validateAttempts(warehouse, parseGuessString(g))),
    hearts: SETTINGS.HEARTS - guesses.length - extraAttempts,
    extraAttempts,
    fulfillments,
    win,
  };
};
