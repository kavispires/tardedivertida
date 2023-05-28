// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
import { BoxXIcon } from 'icons/BoxXIcon';
import { WritingIcon } from 'icons/WritingIcon';

export function WritingHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<WritingIcon />}>{children}</MetricHighlight>;
}

export function WrongGuessHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<BoxXIcon />}>{children}</MetricHighlight>;
}
