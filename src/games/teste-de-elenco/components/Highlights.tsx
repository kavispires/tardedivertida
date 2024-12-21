// Icons
import { ClipboardIcon } from 'icons/ClipboardIcon';
import { MovieStarIcon } from 'icons/MovieStarIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ActorHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MovieStarIcon />}>{children}</MetricHighlight>;
}

export function ScriptTraitHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<ClipboardIcon />}>{children}</MetricHighlight>;
}
