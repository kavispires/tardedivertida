// Icons
import { PlayerIconsIcon } from 'icons/PlayerIconsIcon';
import { MagicSkullIcon } from 'icons/MagicSkullIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ItemsHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<PlayerIconsIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}

export function CurseItemHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<MagicSkullIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
