// Icons
import { HandOfCardsIcon } from '@icons/HandOfCardsIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

export function HandOfCardsHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<HandOfCardsIcon />}>{children}</MetricHighlight>;
}
