// Hooks
import { useCardWidth } from 'hooks/useCardWidth';

export function useSpriteWidth() {
  return useCardWidth(12, { minWidth: 48, maxWidth: 72, margin: 12 });
}
