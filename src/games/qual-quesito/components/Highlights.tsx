// Icons
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ThingHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MysteryBoxIcon />}>{children}</MetricHighlight>;
}
