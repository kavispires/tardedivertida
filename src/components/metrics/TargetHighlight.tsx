// Icons
import { TargetIcon } from 'icons/TargetIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a target icon for goal-related metrics
 */
export function TargetHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<TargetIcon />}
      type={type}
      iconSize={iconSize}
      className={className}
    >
      {children}
    </MetricHighlight>
  );
}
