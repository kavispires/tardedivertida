import clsx from 'clsx';
import { IconAvatar } from 'components/icons/IconAvatar';
import { ReactNode } from 'react';

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
  negative?: boolean;
};

export function MetricHighlight({ children, icon, negative }: MetricHighlightProps) {
  return (
    <span className={clsx('metric-highlight', negative && 'metric-highlight--negative')}>
      {children} <IconAvatar size="small" icon={icon} />
    </span>
  );
}
