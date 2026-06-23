// Icons
import { RobotIcon } from '@icons/RobotIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a robot icon for bot-related metrics
 */
export function BotHighlight(props: HighlightProps) {
  return (
    <MetricHighlight
      icon={<RobotIcon />}
      {...props}
    />
  );
}
