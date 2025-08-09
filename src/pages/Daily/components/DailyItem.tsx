import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useLongPress } from 'react-use';
// Ant Design Resources
import { Tooltip } from 'antd';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { getSource, type ItemCardProps } from 'components/cards/ItemCard';
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
// Internal
import { useDailyChallenge } from '../hooks/useDailyChallenge';

const defaultOptions = {
  isPreventDefault: false,
  delay: 1000,
};

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

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchEnd = () => {
      if (open) {
        setOpen(false);
      }
    };

    // Add event listeners when tooltip is open
    if (open) {
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      document.addEventListener('mouseup', handleTouchEnd, { passive: true });
    }

    // Cleanup function to remove the event listeners
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mouseup', handleTouchEnd);
    };
  }, [open]);

  const height = `${width}px`;
  const divPadding = padding === 0 ? { padding: 0 } : {};

  const tooltipTitle = title ?? itemsDictionary[id];

  // Start showing tooltip on long press, and hide when released
  const longPressEvent = useLongPress(() => tooltipTitle && setOpen(true), defaultOptions);

  return (
    <Tooltip
      title={tooltipTitle}
      placement="top"
      open={open}
      trigger={[]}
      destroyTooltipOnHide={true}
      styles={{
        root: {
          pointerEvents: 'none',
        },
      }}
      {...longPressEvent}
    >
      <div className={clsx('item-card', className)} style={{ width: `${width}px`, height, ...divPadding }}>
        <Sprite source={source} id={itemId} width={width} title={title} padding={padding} />
      </div>
    </Tooltip>
  );
}
