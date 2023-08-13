import { useEffectOnce } from 'react-use';
import { useGlobalState } from './useGlobalState';
import { useCardWidth } from './useCardWidth';

/**
 * Setup basic app settings
 * - Set the canvas size to the card width
 */
export function useAppSetup() {
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const cardWidth = useCardWidth(5, {
    gap: 16,
    minWidth: 250,
    maxWidth: 500,
    margin: 16,
    containerId: 'app',
  });

  useEffectOnce(() => {
    if (canvasSize === 50) {
      setCanvasSize(cardWidth);
    }
  });
}
