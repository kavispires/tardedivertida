import clsx from 'clsx';
import { useState, useEffect, useRef, useCallback } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { getSource, type ItemCardProps } from 'components/cards/ItemCard';
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
// Internal
import { useDailyChallenge } from '../hooks/useDailyChallenge';

/**
 * An item entry component.
 * On a long press (1s), it displays the name of the item in a tooltip, if available.
 * The tooltip is shown while pressing and hidden when released.
 */
export function DailyItem({
  id,
  width = DEFAULT_SPRITE_SIZE,
  className,
  title,
  padding = DEFAULT_PADDING,
}: Omit<ItemCardProps, 'text'>) {
  const { itemsDictionary } = useDailyChallenge();
  const [source, itemId] = getSource(id);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTitle = title ?? itemsDictionary[id];

  // Reset timer and close tooltip on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle press events
  const startTimer = useCallback(() => {
    // Don't start the timer if there's no tooltip title to display
    if (!tooltipTitle) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, [tooltipTitle]);

  // Handle events on the document level
  useEffect(() => {
    // If there's no tooltip title, don't set up any listeners
    if (!tooltipTitle) return;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        startTimer();
      }
    };

    const handleEnd = () => {
      // Only clear the timer if we haven't shown the tooltip yet
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // If we were pressing our element and the tooltip is open, close it
      setOpen(false);
    };

    // Add listeners to handle press and release events
    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    document.addEventListener('touchcancel', handleEnd, { passive: true });
    document.addEventListener('mousedown', handleStart, { passive: true });
    document.addEventListener('mouseup', handleEnd, { passive: true });
    document.addEventListener('mouseleave', handleEnd, { passive: true });

    return () => {
      // Clean up listeners
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
      document.removeEventListener('mousedown', handleStart);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('mouseleave', handleEnd);
    };
  }, [startTimer, tooltipTitle]);

  const height = `${width}px`;
  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <Tooltip title={tooltipTitle} placement="top" open={tooltipTitle ? open : false} trigger={[]}>
      <div
        className={clsx('item-card', className)}
        style={{ width: `${width}px`, height, ...divPadding }}
        ref={containerRef}
      >
        <Sprite source={source} id={itemId} width={width} title={title} padding={padding} />
      </div>
    </Tooltip>
  );
}
