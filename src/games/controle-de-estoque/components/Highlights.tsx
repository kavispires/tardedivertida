// Icons
import { OnlineOrderIcon } from 'icons/OnlineOrderIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function OrdersHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<OnlineOrderIcon />}>{children}</MetricHighlight>;
}
