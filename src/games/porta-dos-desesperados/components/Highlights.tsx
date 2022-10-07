// Components
import { MagicCrystalIcon } from 'components/icons/MagicCrystalIcon';
import { MagicDoorIcon } from 'components/icons/MagicDoorIcon';
import { MagicHourGlassIcon } from 'components/icons/MagicHourGlassIcon';
import { MagicBookIcon } from 'components/icons/MagicBookIcon';
import { MetricHighlight, MetricHighlightProps } from 'components/text/MetricHighlight';

type HighlightProps = Pick<MetricHighlightProps, 'children' | 'negative'>;

export function BookHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MagicBookIcon />}>{children}</MetricHighlight>;
}

export function CrystalHighlight({ children, negative }: HighlightProps) {
  return (
    <MetricHighlight icon={<MagicCrystalIcon />} negative={negative}>
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
