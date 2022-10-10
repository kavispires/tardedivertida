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
};

export function MetricHighlight({ children, icon, type }: MetricHighlightProps) {
  return (
    <span className={clsx('metric-highlight', type && `metric-highlight--${type}`)}>
      {children} <IconAvatar size="small" icon={icon} />
    </span>
  );
}
