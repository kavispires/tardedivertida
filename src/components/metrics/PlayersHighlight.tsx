// Icons
import { PlayersIcon } from 'icons/PlayersIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a players group icon for multi-player metrics
 */
export function PlayersHighlight(props: HighlightProps) {
  return (
    <MetricHighlight
      icon={<PlayersIcon />}
      {...props}
    />
  );
}
