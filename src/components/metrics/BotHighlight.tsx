import { RobotIcon } from 'icons/RobotIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function BotHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<RobotIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
