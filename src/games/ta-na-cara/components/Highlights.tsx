// Icons
import { NoIcon } from 'icons/NoIcon';
import { QuestionsIcon } from 'icons/QuestionsIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function QuestionsHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<QuestionsIcon />} type={type} iconSize={iconSize} className={className}>
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
