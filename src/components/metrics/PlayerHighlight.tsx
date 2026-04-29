// Icons
import { PlayerIcon } from 'icons/PlayerIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a player icon for single player metrics
 */
export function PlayerHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<PlayerIcon />}
      type={type}
      iconSize={iconSize}
      className={className}
    >
      {children}
    </MetricHighlight>
  );
}
