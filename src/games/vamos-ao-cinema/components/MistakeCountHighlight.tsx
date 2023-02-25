// Icons
import { ScaredIcon } from 'icons/ScaredIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function MistakeCountHighlight({ children, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<ScaredIcon />} type="negative" iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
