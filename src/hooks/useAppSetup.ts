import { useEffectOnce, useLocalStorage } from 'react-use';
// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';
import { useCardWidth } from './useCardWidth';
import { useGlobalState } from './useGlobalState';

/**
 * Setup basic app settings
 * - Setup username
 * - Setup user avatar
 * - Set the canvas size to the card width
 */
export function useAppSetup() {
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [localUsername] = useLocalStorage('username', '');
  const [localAvatarId] = useLocalStorage('avatarId', '');

  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');
  const cardWidth = useCardWidth(5, {
    gap: 16,
    minWidth: 250,
    maxWidth: 500,
    margin: 16,
  });

  useEffectOnce(() => {
    setUsername(localUsername ?? '');
    setUserAvatarId(localAvatarId ?? '');
  });

  useEffectOnce(() => {
    if (canvasSize === 50) {
      setCanvasSize(cardWidth);
    }
  });
}
