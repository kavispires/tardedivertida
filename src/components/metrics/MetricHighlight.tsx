import type { AvatarSize } from 'antd/lib/avatar/AvatarContext';
import clsx from 'clsx';
import type { ReactNode } from 'react';
// Components
import { Icon } from '@components/general/Icon';
// Sass
import styles from './MetricHighlight.module.scss';

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
  iconPlacement = 'before',
}: MetricHighlightProps) {
  return (
    <span
      className={clsx(
        styles.metricHighlight,
        type && styles[`metricHighlight${type.charAt(0).toUpperCase() + type.slice(1)}`],

        className,
      )}
    >
      {iconPlacement === 'before' && (
        <>
          <Icon
            size={iconSize}
            icon={icon}
          />{' '}
        </>
      )}
      {children}
      {iconPlacement === 'after' && (
        <>
          {' '}
          <Icon
            size={iconSize}
            icon={icon}
          />
        </>
      )}
    </span>
  );
}

export type HighlightProps = Omit<MetricHighlightProps, 'icon'>;
