// Icons
import { PlayerIcon } from '@icons/PlayerIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a player icon for single player metrics
 */
export function PlayerHighlight(props: HighlightProps) {
  return (
    <MetricHighlight
      icon={<PlayerIcon />}
      {...props}
    />
  );
}
