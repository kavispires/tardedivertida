import { PlayersIcon } from 'icons/PlayersIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function PlayersHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<PlayersIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
