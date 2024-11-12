// Hooks
import { useCardWidth } from 'hooks/useCardWidth';

export const useLocationWidth = (cityWidth: number) => {
  return useCardWidth(cityWidth + 2, {
    maxWidth: 300,
    gap: 16,
  });
};
