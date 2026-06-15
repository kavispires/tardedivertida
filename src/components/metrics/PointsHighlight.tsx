// Icons
import { StarIcon } from 'icons/StarIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a star icon for points-related metrics
 */
export function PointsHighlight(props: HighlightProps) {
  return (
    <MetricHighlight
      icon={<StarIcon />}
      {...props}
    />
  );
}
