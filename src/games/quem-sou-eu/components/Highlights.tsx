// Icons
import { NoIcon } from 'icons/NoIcon';
import { YesIcon } from 'icons/YesIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function PositiveHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<YesIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}

export function NegativeHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<NoIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
