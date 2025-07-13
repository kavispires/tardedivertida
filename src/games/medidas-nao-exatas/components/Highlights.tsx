// Icons
import { GuessIcon } from 'icons/GuessIcon';
import { ListIcon } from 'icons/ListIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
// Icons

export function WordsHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<ListIcon />}>{children}</MetricHighlight>;
}

export function SecretWordHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<GuessIcon />}>{children}</MetricHighlight>;
}
