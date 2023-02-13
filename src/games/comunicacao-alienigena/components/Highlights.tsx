import { IconsIcon } from 'components/icons/IconsIcon';
import { MagicSkullIcon } from 'components/icons/MagicSkullIcon';
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
