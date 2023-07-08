// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
import { CompassIcon } from 'icons/CompassIcon';
import { MapIcon } from 'icons/MapIcon';
import { TreeIcon } from 'icons/TreeIcon';

export function CompassHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<CompassIcon />}>{children}</MetricHighlight>;
}

export function MapHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MapIcon />}>{children}</MetricHighlight>;
}

export function TreeHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<TreeIcon />}>{children}</MetricHighlight>;
}
