// Hooks
import { useCardWidth } from 'hooks/useCardWidth';

export function useSpriteWidth() {
  return useCardWidth(12, { minWidth: 64, maxWidth: 72, margin: 6 });
}
