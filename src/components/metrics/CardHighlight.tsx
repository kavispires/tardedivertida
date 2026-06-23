// Icons
import { ImageCardsIcon } from '@icons/ImageCardsIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a card icon for card-related metrics
 */
export function CardHighlight(props: HighlightProps) {
  return (
    <MetricHighlight
      icon={<ImageCardsIcon />}
      {...props}
    />
  );
}
