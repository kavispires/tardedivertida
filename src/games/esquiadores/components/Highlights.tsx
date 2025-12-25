// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
import { LodgeIcon } from 'icons/LodgeIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
// Icons

export function ChipsHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<GamblingChipIcon />}>{children}</MetricHighlight>;
}

export function LodgeHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<LodgeIcon />}>{children}</MetricHighlight>;
}
