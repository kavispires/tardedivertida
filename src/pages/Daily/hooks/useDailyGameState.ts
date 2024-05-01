import { useState } from 'react';

export function useDailyGameState<TState = PlainObject>(initialState: TState) {
  const [state, setState] = useState<TState>(initialState);

  const updateState = (newState: Partial<TState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  return { state, setState, updateState };
}
