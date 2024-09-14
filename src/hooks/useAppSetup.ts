import { useEffectOnce } from 'react-use';
// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';
import { useCardWidth } from './useCardWidth';

/**
 * Setup basic app settings
 * - Set the canvas size to the card width
 */
export function useAppSetup() {
  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');
  const cardWidth = useCardWidth(5, {
    gap: 16,
    minWidth: 250,
    maxWidth: 500,
    margin: 16,
  });

  useEffectOnce(() => {
    if (canvasSize === 50) {
      setCanvasSize(cardWidth);
    }
  });
}
