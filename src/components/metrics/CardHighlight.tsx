// Icons
import { ImageCardsIcon } from 'icons/ImageCardsIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function CardHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<ImageCardsIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
