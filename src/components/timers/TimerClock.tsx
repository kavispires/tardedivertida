import { MetricHighlight, MetricHighlightProps } from 'components/metrics/MetricHighlight';
import { useCountdown, useCountdownSettings } from 'hooks/useCountdown';
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
import { ReactNode } from 'react';

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
} & useCountdownSettings &
  Omit<MetricHighlightProps, 'icon' | 'children'>;

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
  ...timerProps
}: TimerClockProps) {
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
