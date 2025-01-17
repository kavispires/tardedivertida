import { type RefObject, useEffect, useState } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

/**
 * Custom hook to determine the direction of the mouse movement relative to a referenced HTML element.
 *
 * @param ref - A reference to an HTML element.
 * @param axis - The axis to determine the direction ('horizontal' or 'vertical'). Defaults to 'horizontal'.
 * @returns The direction of the mouse movement relative to the element ('left' or 'right' for horizontal axis, 'up' or 'down' for vertical axis).
 *
 * @example
 * ```typescript
 * const ref = useRef<HTMLDivElement>(null);
 * const direction = useMouseDirection(ref, 'horizontal');
 * ```
 */
export function useMouseDirection(
  ref: RefObject<HTMLElement>,
  axis: 'horizontal' | 'vertical' = 'horizontal',
) {
  const [direction, setDirection] = useState<Direction>('right');

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const elementBox = ref.current.getBoundingClientRect();
        const elementCenterX = elementBox.left + elementBox.width / 2;
        const elementCenterY = elementBox.top + elementBox.height / 2;

        if (axis === 'horizontal') {
          setDirection(event.clientX < elementCenterX ? 'left' : 'right');
        } else {
          setDirection(event.clientY < elementCenterY ? 'up' : 'down');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [axis, ref]);

  return direction;
}
