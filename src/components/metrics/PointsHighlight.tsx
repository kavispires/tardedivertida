import { StarIcon } from 'icons/StarIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function PointsHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<StarIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
