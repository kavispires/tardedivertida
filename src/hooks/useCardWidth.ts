import { LegacyRef, useMemo } from "react";
import { useMeasure, useWindowSize } from "react-use";

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
  },
): number {
  const {
    gap = 32,
    minWidth = 120,
    maxWidth = 300,
    margin = 0,
  } = options ?? {};
  const { width: windowWidth } = useWindowSize();
  const width = options?.containerWidth ?? windowWidth;

  return useMemo(() => {
    const value = Math.min(
      Math.max(Math.floor((width - margin) / quantity) - gap, minWidth),
      maxWidth,
    );
    return Number.isNaN(value) ? minWidth : value;
  }, [width, quantity, gap, minWidth, maxWidth, margin]);
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
  },
): [number, LegacyRef<TRef>] {
  const [ref, { width }] = useMeasure();
  const {
    gap = 32,
    minWidth = 120,
    maxWidth = 300,
    margin = 0,
  } = options ?? {};

  const cardWidth = useMemo(() => {
    const value = Math.min(
      Math.max(Math.floor((width - margin) / quantity) - gap, minWidth),
      maxWidth,
    );
    return Number.isNaN(value) ? minWidth : value;
  }, [width, quantity, gap, minWidth, maxWidth, margin]);

  const containerRef = ref as unknown as LegacyRef<TRef>;

  return [cardWidth, containerRef];
}
