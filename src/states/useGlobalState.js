import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  loaders: false,
  isAuthenticated: false,
  appStartedAt: Date.now(),
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState };

export default useGlobalState;
