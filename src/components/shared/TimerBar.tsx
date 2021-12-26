import { Progress, ProgressProps } from 'antd';

interface TimerBarProps extends ProgressProps {
  steps?: number;
  value: number;
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
      {...props}
    />
  );
}
