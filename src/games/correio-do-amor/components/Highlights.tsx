// Icons
import { DeckIcon } from 'icons/DeckIcon';
import { NoIcon } from 'icons/NoIcon';
import { SecurityIcon } from 'icons/SecurityIcon';
import { TrashIcon } from 'icons/TrashIcon';
import { VictoryCoinIcon } from 'icons/VictoryCoinIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function DeckHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<DeckIcon />}>{children}</MetricHighlight>;
}

export function ScoreHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<VictoryCoinIcon />}>{children}</MetricHighlight>;
}

export function DiscardHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<TrashIcon />}>{children}</MetricHighlight>;
}

export function EliminatedHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<NoIcon />}>{children}</MetricHighlight>;
}

export function ReservedHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<SecurityIcon />}>{children}</MetricHighlight>;
}
