// Icons
import { MovieStarIcon } from 'icons/MovieStarIcon';
import { ClipboardIcon } from 'icons/ClipboardIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ActorHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MovieStarIcon />}>{children}</MetricHighlight>;
}

export function ScriptTraitHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<ClipboardIcon />}>{children}</MetricHighlight>;
}
