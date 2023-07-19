import { useMemo } from 'react';
import { useDimensions } from './useDimensions';

/**
 * Get a card width in px based on the window size of the user's browser or given container
 * @param quantity how many cards should be fitted in the page screen width
 * @param options the options object
 * @param options.gap total value of padding and margin on the left and right of the card
 * @param options.minWidth minimum width of a card
 * @param options.maxWidth maximum width of a card
 * @param options.margin the outer margin of the container that should be removed from the width
 * @param options.containerId the id of the container element where the cards will live in which is the total width
 * @returns the card width in px
 */
export function useCardWidth(
  quantity: number,
  options?: {
    gap?: number;
    minWidth?: number;
    maxWidth?: number;
    margin?: number;
    containerId?: string;
  }
): number {
  const { gap = 32, minWidth = 120, maxWidth = 300, margin = 0, containerId } = options ?? {};
  const [width] = useDimensions(containerId);
  return useMemo(() => {
    const value = Math.min(Math.max(Math.floor((width - margin) / quantity) - gap, minWidth), maxWidth);
    return Number.isNaN(value) ? minWidth : value;
  }, [width, quantity, gap, minWidth, maxWidth, margin]);
}
