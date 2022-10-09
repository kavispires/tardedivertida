import { StarIcon } from 'components/icons/StarIcon';
import { MetricHighlight, MetricHighlightProps } from 'components/text/MetricHighlight';

type HighlightProps = Pick<MetricHighlightProps, 'children' | 'type'>;

export function PointsHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<StarIcon />} type={type}>
      {children}
    </MetricHighlight>
  );
}
