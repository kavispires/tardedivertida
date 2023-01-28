import { NoIcon } from 'components/icons/NoIcon';
import { YesIcon } from 'components/icons/YesIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

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
