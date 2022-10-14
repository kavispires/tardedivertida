import { ReactNode } from 'react';
import clsx from 'clsx';
// Components
import { IconAvatar } from 'components/icons/IconAvatar';

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
   * Custom class
   */
  className?: string;
};

export function MetricHighlight({ children, icon, type, className }: MetricHighlightProps) {
  return (
    <span className={clsx('metric-highlight', type && `metric-highlight--${type}`, className)}>
      {children} <IconAvatar size="small" icon={icon} />
    </span>
  );
}
