// Icons
import { ClockIcon } from 'icons/ClockIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function TimeHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<ClockIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
