import { useMemo } from 'react';
import { useDimensions } from './useDimensions';

/**
 * Get a card width in px based on the window size of the user's browser
 * @param quantity how many cards should be fitted in the page screen width
 * @param gap total value of padding and margin on the left and right of the card
 * @param minWidth minimum width of a card
 * @param maxWidth maximum width of a card
 * @param margin the outer margin of the container that should be removed from the width
 * @param containerId the id of the container element where the cards will live in which is the total width
 * @returns
 */
export function useCardWidth(
  quantity: number,
  gap = 32,
  minWidth = 120,
  maxWidth = 300,
  margin = 0,
  containerId?: string
): number {
  const [width] = useDimensions(containerId);
  return useMemo(() => {
    const value = Math.min(Math.max(Math.floor((width - margin) / quantity) - gap, minWidth), maxWidth);
    return Number.isNaN(value) ? minWidth : value;
  }, [width, quantity, gap, minWidth, maxWidth, margin]);
}
