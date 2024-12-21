import type { ReactNode } from 'react';
// Hooks
import { useCountdown, type useCountdownSettings } from 'hooks/useCountdown';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { MetricHighlight, type MetricHighlightProps } from 'components/metrics/MetricHighlight';

const padTime = (value: number) => (value < 10 ? `0${value}` : value);

type TimedTimerClockProps = {
  /**
   * Replacement icon for the clock icon
   */
  icon?: ReactNode;
  /**
   * Optional children that comes after the time
   */
  children?: ReactNode;
} & useCountdownSettings &
  Omit<MetricHighlightProps, 'icon' | 'children'>;

/**
 * Timer highlight with countdown functionality
 */
export function TimedTimerClock({
  icon,
  type,
  iconSize,
  children,
  className = '',
  iconPlacement = 'before',
  ...timerProps
}: TimedTimerClockProps) {
  const { minutes, seconds } = useCountdown({ ...timerProps });

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
