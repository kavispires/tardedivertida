import { ImageCardsIcon } from 'components/icons/ImageCardsIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function CardHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<ImageCardsIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
