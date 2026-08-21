// Icons
import { HieroglyphIcon } from '@icons/HieroglyphIcon';
import { MagicSkullIcon } from '@icons/MagicSkullIcon';
import { PlayerIconsIcon } from '@icons/PlayerIconsIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

export function ItemsHighlight(props: Omit<HighlightProps, 'icon'>) {
  return (
    <MetricHighlight
      icon={<PlayerIconsIcon />}
      {...props}
    />
  );
}

export function HieroglyphHighlight(props: Omit<HighlightProps, 'icon'>) {
  return (
    <MetricHighlight
      icon={<HieroglyphIcon />}
      {...props}
    />
  );
}

export function CurseItemHighlight(props: Omit<HighlightProps, 'icon'>) {
  return (
    <MetricHighlight
      icon={<MagicSkullIcon />}
      {...props}
    />
  );
}
