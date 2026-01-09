import { type Ref, useMemo } from 'react';
import { useMeasure, useWindowSize } from 'react-use';

/**
 * Get a card width in px based on the window size of the user's browser
 * @param quantity how many cards should be fitted in the page screen width
 * @param options the options object
 * @param options.gap total value of padding and margin on the left and right of the card
 * @param options.minWidth minimum width of a card
 * @param options.maxWidth maximum width of a card
 * @param options.margin the outer margin of the container that should be removed from the width
 * @param options.containerWidth the width of the container that should be used instead of the window width
 * @returns the card width in px
 */
export function useCardWidth(
  quantity: number,
  options?: {
    gap?: number;
    minWidth?: number;
    maxWidth?: number;
    margin?: number;
    containerWidth?: number;
    aspectRatio?: number;
    maxHeight?: number;
  },
): number {
  const { gap = 32, minWidth = 120, maxWidth = 300, margin = 0, aspectRatio, maxHeight } = options ?? {};
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const width = options?.containerWidth ?? windowWidth;

  return useMemo(() => {
    let calculatedMaxWidth = maxWidth;

    // If aspectRatio is provided, limit width based on height
    if (aspectRatio) {
      const effectiveMaxHeight = maxHeight ?? windowHeight * 0.8;
      const maxWidthFromHeight = effectiveMaxHeight * aspectRatio;
      calculatedMaxWidth = Math.min(maxWidth, maxWidthFromHeight);
    }

    // Ensure calculatedMaxWidth is at least minWidth to give minWidth priority
    calculatedMaxWidth = Math.max(calculatedMaxWidth, minWidth);

    const value = Math.min(
      Math.max(Math.floor((width - margin) / quantity) - gap, minWidth),
      calculatedMaxWidth,
    );
    return Number.isNaN(value) ? minWidth : value;
  }, [width, quantity, gap, minWidth, maxWidth, margin, aspectRatio, maxHeight, windowHeight]);
}

/**
 * Get a card width in px based on the window size of given container used with the containerRef
 * @param quantity how many cards should be fitted in the page screen width
 * @param options the options object
 * @param options.gap total value of padding and margin on the left and right of the card
 * @param options.minWidth minimum width of a card
 * @param options.maxWidth maximum width of a card
 * @param options.margin the outer margin of the container that should be removed from the width
 * @returns
 */
export function useCardWidthByContainerRef<TRef = HTMLDivElement>(
  quantity: number,
  options?: {
    gap?: number;
    minWidth?: number;
    maxWidth?: number;
    margin?: number;
    aspectRatio?: number;
    maxHeight?: number;
  },
): [number, Ref<TRef>] {
  const [ref, { width }] = useMeasure();
  const { gap = 32, minWidth = 120, maxWidth = 300, margin = 0, aspectRatio, maxHeight } = options ?? {};
  const { height: windowHeight } = useWindowSize();

  const cardWidth = useMemo(() => {
    let calculatedMaxWidth = maxWidth;

    // If aspectRatio is provided, limit width based on height
    if (aspectRatio) {
      const effectiveMaxHeight = maxHeight ?? windowHeight * 0.8;
      const maxWidthFromHeight = effectiveMaxHeight * aspectRatio;
      calculatedMaxWidth = Math.min(maxWidth, maxWidthFromHeight);
    }

    // Ensure calculatedMaxWidth is at least minWidth to give minWidth priority
    calculatedMaxWidth = Math.max(calculatedMaxWidth, minWidth);

    const value = Math.min(
      Math.max(Math.floor((width - margin) / quantity) - gap, minWidth),
      calculatedMaxWidth,
    );
    return Number.isNaN(value) ? minWidth : value;
  }, [width, quantity, gap, minWidth, maxWidth, margin, aspectRatio, maxHeight, windowHeight]);

  const containerRef = ref as unknown as Ref<TRef>;

  return [cardWidth, containerRef];
}
