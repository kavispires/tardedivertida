// Icons
import { IconsIcon } from 'icons/IconsIcon';
import { MagicSkullIcon } from 'icons/MagicSkullIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function ItemsHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<IconsIcon />} type={type} iconSize={iconSize} className={className}>
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
