import { Progress } from 'antd';

type TimerBarProps = {
  steps?: number;
  value: number;
  total: number;
  type?: 'circle' | 'line' | 'dashboard' | undefined;
  strokeLinecap?: 'round' | 'butt' | 'square' | undefined;
  status?: 'success' | 'normal' | 'exception' | 'active' | undefined;
};

/**
 * Time Bar presentational component used in timed operations
 * @param props
 * @returns
 */
export function TimerBar({ steps, strokeLinecap, total, type, value, status }: TimerBarProps) {
  const percentage = 100 - (value * 100) / total;
  return (
    <Progress
      percent={percentage}
      steps={steps}
      type={type}
      showInfo={false}
      strokeLinecap={strokeLinecap}
      style={{ marginBottom: '1rem' }}
      size={steps && steps > 30 ? 'small' : undefined}
      status={status}
    />
  );
}
