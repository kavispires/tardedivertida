// Icons
import { RatingIcon } from 'icons/RatingIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function HappinessHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<RatingIcon />}>{children}</MetricHighlight>;
}
