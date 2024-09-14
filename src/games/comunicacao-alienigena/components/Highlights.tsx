// Icons
import { HieroglyphIcon } from 'icons/HieroglyphIcon';
import { MagicSkullIcon } from 'icons/MagicSkullIcon';
import { PlayerIconsIcon } from 'icons/PlayerIconsIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ItemsHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<PlayerIconsIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}

export function HieroglyphHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<HieroglyphIcon />} type={type} iconSize={iconSize} className={className}>
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
