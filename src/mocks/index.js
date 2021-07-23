import { setGlobalState } from '../hooks';

export const player = {
  id: '_bob',
  avatarId: '1',
  name: 'Bob',
  ready: false,
  score: 0,
  updatedAt: Date.now(),
};

export const mockPlayer = (overrideData = {}) => ({ ...player, ...overrideData });

export const mockGlobalUser = (overrideData = {}) => {
  setGlobalState('userId', overrideData.userId ?? '_bob');
  setGlobalState('username', overrideData.username ?? 'Bob');
  setGlobalState('userAvatarId', overrideData.userAvatarId ?? '1');
};

export const mockLoading = () => {
  setGlobalState('loaders', { testing: true });
};
