import { useMemo } from 'react';
import { useDimensions } from '.';

/**
 *
 * @param {number} quantity how many cards should be fitted in the page screen width
 * @param {number} gap total value of padding and margin on the left and right of the card
 * @param {number} minWidth minimum width of a card
 * @returns
 */
export function useCardWidth(quantity, gap = 32, minWidth = 120, maxWidth = 300) {
  const [width] = useDimensions();

  return useMemo(() => {
    return Math.min(Math.max(Math.floor(width / quantity) - gap, minWidth), maxWidth);
  }, [width, quantity, gap, minWidth, maxWidth]);
}
