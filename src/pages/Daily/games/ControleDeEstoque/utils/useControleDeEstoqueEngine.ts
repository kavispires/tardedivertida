import { cloneDeep } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Internal
import { getGuessString, getInitialState, validateAttempts } from './helpers';
import { PHASES, SETTINGS } from './settings';
import type { DailyControleDeEstoqueEntry, GameState, SessionState } from './types';
// Utils

export function useControleDeEstoqueEngine(data: DailyControleDeEstoqueEntry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState } = useDailyGameState<GameState>(initialState);

  const { session, updateSession } = useDailySessionState<SessionState>({
    latestAttempt: null,
    activeOrder: null,
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

  const currentGood: string | undefined = data.goods[state.warehouse.filter(Boolean).length];

  /**
   * Places a good in the warehouse
   */
  const onPlaceGood = (shelfIndex: number) => {
    if (shelfIndex >= 0 && currentGood) {
      setState((prev) => {
        const copy = cloneDeep(prev);

        copy.warehouse[shelfIndex] = currentGood;
        copy.lastPlacedGoodId = currentGood;
        playSFX('swap');

        if (copy.warehouse.every(Boolean)) {
          copy.phase = PHASES.FULFILLING;
        }

        return copy;
      });
    }
  };

  /**
   * Selects an order to fulfill
   */
  const onSelectOrder = (order: string) => {
    playSFX('bubbleIn');
    updateSession({ activeOrder: order });
  };

  /**
   * Fulfills an order
   * (assigns an order to a shelf)
   */
  const onFulfill = (shelfIndex: number) => {
    playSFX('swap');
    setState((prev) => {
      const copy = cloneDeep(prev);
      if (session.activeOrder) {
        copy.fulfillments.push({
          order: session.activeOrder,
          shelfIndex: shelfIndex,
        });
        updateSession({ activeOrder: null });
      }
      return copy;
    });
  };

  /**
   * Takes back an order from a shelf
   */
  const onTakeBack = (orderId: string) => {
    playSFX('bubbleOut');
    setState((prev) => {
      const copy = cloneDeep(prev);
      copy.fulfillments = copy.fulfillments.filter((fulfillment) => fulfillment.order !== orderId);
      updateSession({ activeOrder: orderId });
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
          'You already tried this combination. Try another one!',
        ),
        duration: 5,
      });

      return updateSession({
        latestAttempt: Date.now(),
      });
    }

    const attemptResult = validateAttempts(state.warehouse, state.fulfillments);

    const isAllCorrect = attemptResult.every(Boolean);

    if (!isAllCorrect) {
      message.warning({
        content: translate(
          'Um ou mais produtos estão fora de lugar. Tente novamente!',
          'One or more products are out of place. Try again!',
        ),
        duration: 3,
      });
      playSFX('wrong');
    }

    setState((prev) => {
      const copy = cloneDeep(prev);

      copy.evaluations.push(attemptResult);
      copy.guesses.push(newGuessString);

      if (isAllCorrect) {
        copy.status = STATUSES.WIN;
        playSFX('win');
      } else {
        copy.hearts -= 1;
        if (copy.hearts === 0) {
          playSFX('lose');
          copy.status = STATUSES.WIN;
        }
      }
      updateSession({ latestAttempt: Date.now() });
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

  const reset = () => {
    const override: Partial<GameState> = {
      warehouse: Array(data.goods.length).fill(null),
      guesses: [],
      extraAttempts: state.extraAttempts + 1,
      hearts: SETTINGS.HEARTS - state.extraAttempts - 1,
    };

    const resetState = getInitialState(data, override);
    setState(resetState);
  };

  return {
    hearts: state.hearts,
    phase: state.phase,
    warehouse: state.warehouse,
    fulfillments: state.fulfillments,
    lastPlacedGoodId: state.lastPlacedGoodId,
    guesses: state.guesses,
    evaluations: state.evaluations,
    orders: data.orders,
    currentGood,
    latestAttempt: session.latestAttempt,
    activeOrder: session.activeOrder,
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
