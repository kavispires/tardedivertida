// Icons
import { MagicBookIcon } from 'icons/MagicBookIcon';
import { MagicCrystalIcon } from 'icons/MagicCrystalIcon';
import { MagicDoorIcon } from 'icons/MagicDoorIcon';
import { MagicHourGlassIcon } from 'icons/MagicHourGlassIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function BookHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MagicBookIcon />}>{children}</MetricHighlight>;
}

export function CrystalHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<MagicCrystalIcon />}
      type={type}
    >
      {children}
    </MetricHighlight>
  );
}

export function DoorHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MagicDoorIcon />}>{children}</MetricHighlight>;
}

export function TimeHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MagicHourGlassIcon />}>{children}</MetricHighlight>;
}
