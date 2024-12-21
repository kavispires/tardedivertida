// Icons
import { BrickWallIcon } from 'icons/BrickWallIcon';
import { ConeIcon } from 'icons/ConeIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ConstructionHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<BrickWallIcon />}>{children}</MetricHighlight>;
}

export function ConeHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<ConeIcon />}>{children}</MetricHighlight>;
}
