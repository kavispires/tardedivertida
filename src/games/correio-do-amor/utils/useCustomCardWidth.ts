// Hooks
import { useCardWidth } from '@hooks/useCardWidth';

export function useCustomCardWidth() {
  const cardWidth = useCardWidth(8, { minWidth: 128 });

  return {
    cardWidth,
    passiveCardWidth: cardWidth * 0.75,
  };
}
