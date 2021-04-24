import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  appStartedAt: Date.now(),
  notification: {
    type: null,
    message: null,
    description: null,
  },
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState };

export default useGlobalState;
