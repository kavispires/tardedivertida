import { useEffectOnce, useLocalStorage } from 'react-use';
// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';
import { useCardWidth } from './useCardWidth';
import { useGlobalState } from './useGlobalState';
import { useLanguage } from './useLanguage';

/**
 * Setup basic app settings
 * - Setup username
 * - Setup user avatar
 * - Set the canvas size to the card width
 */
export function useAppSetup() {
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const { setLanguage } = useLanguage();
  const [localUsername] = useLocalStorage<string>('username');
  const [localAvatarId] = useLocalStorage<string>('avatarId');

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
    setLanguage(JSON.parse(localStorage.getItem('TD_language') || '"en"') || 'en');

    if (canvasSize === 50) {
      setCanvasSize(cardWidth);
    }
  });
}
