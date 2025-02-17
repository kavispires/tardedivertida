import { useState } from 'react';

export function useDailyGameState<TState = PlainObject>(initialState: TState) {
  const [state, setState] = useState<TState>(initialState);

  const updateState = (newState: Partial<TState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  return { state, setState, updateState };
}

export function useDailySessionState<TState = PlainObject>(initialState: TState) {
  const [session, setSession] = useState<TState>(initialState);

  const updateSession = (newState: Partial<TState>) => {
    setSession((prev) => ({ ...prev, ...newState }));
  };

  return { session, setSession, updateSession };
}
