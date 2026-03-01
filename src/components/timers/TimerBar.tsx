// Ant Design Resources
import { Progress, type ProgressProps } from 'antd';

interface TimerBarProps extends ProgressProps {
  /**
   * Number of steps to divide the progress into
   */
  steps?: number;
  /**
   * The current value of the timer
   */
  value: number;
  /**
   * The total value of the timer
   */
  total: number;
}

/**
 * Time Bar presentational component used in timed operations
 * @param props
 * @returns
 */
export function TimerBar({
  steps,
  strokeLinecap,
  total,
  type = 'line',
  value,
  status = 'active',
  ...props
}: TimerBarProps) {
  const percentage = 100 - (value * 100) / total;
  return (
    <Progress
      percent={percentage}
      steps={steps}
      showInfo={false}
      style={{ marginBottom: '1rem' }}
      size={steps && steps > 30 ? 'small' : undefined}
      type={type}
      {...props}
    />
  );
}
