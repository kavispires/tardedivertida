import { TargetIcon } from 'icons/TargetIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function TargetHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<TargetIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
