import { ReactNode } from 'react';
import clsx from 'clsx';
// Types
import type { AvatarSize } from 'antd/lib/avatar/AvatarContext';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';

export type MetricHighlightProps = {
  /**
   * The text to be highlighted
   */
  children: ReactNode;
  /**
   * The icon representing the metric
   */
  icon: ReactNode;
  /**
   * Indicates if it's a negative metric
   */
  type?: 'positive' | 'negative' | 'default';
  /**
   * The size of the avatar (default: small)
   */
  iconSize?: AvatarSize;
  /**
   * Custom class
   */
  className?: string;
  /**
   * Icon placement (default: after)
   */
  iconPlacement?: 'before' | 'after';
};

export function MetricHighlight({
  children,
  icon,
  type,
  className,
  iconSize = 'small',
  iconPlacement = 'after',
}: MetricHighlightProps) {
  return (
    <span className={clsx('metric-highlight', type && `metric-highlight--${type}`, className)}>
      {iconPlacement === 'before' && (
        <>
          <IconAvatar size={iconSize} icon={icon} />{' '}
        </>
      )}
      {children}
      {iconPlacement === 'after' && (
        <>
          {' '}
          <IconAvatar size={iconSize} icon={icon} />
        </>
      )}
    </span>
  );
}

export type HighlightProps = Pick<MetricHighlightProps, 'children' | 'type' | 'iconSize' | 'className'>;
