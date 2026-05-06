// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { DisguiseIcon } from 'icons/DisguiseIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ImpostorHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<DisguiseIcon />}>{children}</MetricHighlight>;
}

export function WrongGuessHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<BoxXIcon />}>{children}</MetricHighlight>;
}
