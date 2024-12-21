import type { ReactNode } from 'react';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { MetricHighlight, type MetricHighlightProps } from 'components/metrics/MetricHighlight';

const padTime = (value: number) => (value < 10 ? `0${value}` : value);

type TimerClockProps = {
  /**
   * Replacement icon for the clock icon
   */
  icon?: ReactNode;
  /**
   * Optional children that comes after the time
   */
  children?: ReactNode;
  /**
   * Minutes
   */
  minutes?: number;
  /**
   * Seconds
   */
  seconds: number;
} & Omit<MetricHighlightProps, 'icon' | 'children'>;

/**
 * Timer highlight with countdown functionality
 */
export function TimerClock({
  icon,
  type,
  iconSize,
  children,
  className = '',
  iconPlacement = 'before',
  minutes = 0,
  seconds,
}: TimerClockProps) {
  return (
    <MetricHighlight
      icon={icon ?? <AnimatedClockIcon />}
      type={type}
      iconSize={iconSize}
      className={className}
      iconPlacement={iconPlacement}
    >
      {minutes}:{padTime(seconds)}
      {children}
    </MetricHighlight>
  );
}
