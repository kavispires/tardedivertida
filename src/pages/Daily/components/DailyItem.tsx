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
  delay: 750,
};

/**
 * An item entry component.
 * On a long press, it displays the name of the item in a tooltip.
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

  // Add event listeners to close tooltip on mouseDown or touchStart
  useEffect(() => {
    const handleInteraction = () => {
      if (open) {
        setOpen(false);
      }
    };

    // Add the event listeners when tooltip is open
    if (open) {
      document.addEventListener('mousedown', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);
    }

    // Cleanup function to remove the event listeners
    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [open]);

  const height = `${width}px`;
  const divPadding = padding === 0 ? { padding: 0 } : {};

  const tooltipTitle = title ?? itemsDictionary[id];
  const longPressEvent = useLongPress(() => tooltipTitle && setOpen(true), defaultOptions);

  return (
    <Tooltip
      title={tooltipTitle}
      placement="top"
      open={open}
      onOpenChange={(visible) => {
        if (!visible) {
          setOpen(false);
        }
      }}
      {...longPressEvent}
    >
      <div className={clsx('item-card', className)} style={{ width: `${width}px`, height, ...divPadding }}>
        <Sprite source={source} id={itemId} width={width} title={title} padding={padding} />
      </div>
    </Tooltip>
  );
}
