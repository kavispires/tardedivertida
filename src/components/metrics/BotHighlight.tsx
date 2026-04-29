// Icons
import { RobotIcon } from 'icons/RobotIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a robot icon for bot-related metrics
 */
export function BotHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<RobotIcon />}
      type={type}
      iconSize={iconSize}
      className={className}
    >
      {children}
    </MetricHighlight>
  );
}
