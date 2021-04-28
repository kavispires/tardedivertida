import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  gameId: null,
  gameName: null,
  createdAt: null,
  me: '',
  myAvatar: '',
  isAdmin: false,
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState as setGameGlobalState, getGlobalState as getGameGlobalState };

export default useGlobalState;
