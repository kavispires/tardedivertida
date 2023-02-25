import { PlayerIcon } from 'icons/PlayerIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function PlayerHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<PlayerIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
