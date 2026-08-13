// Icons
import { CardIcon } from '@icons/CardIcon';
import { DeckIcon } from '@icons/DeckIcon';
import { NoIcon } from '@icons/NoIcon';
import { RefreshIcon } from '@icons/RefreshIcon.tsx';
import { SecurityIcon } from '@icons/SecurityIcon';
import { TargetIcon } from '@icons/TargetIcon';
import { TrashIcon } from '@icons/TrashIcon';
import { VictoryCoinIcon } from '@icons/VictoryCoinIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

export function DeckHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<DeckIcon />}>{children}</MetricHighlight>;
}

export function ScoreHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<VictoryCoinIcon />}>{children}</MetricHighlight>;
}

export function DiscardHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<TrashIcon />}>{children}</MetricHighlight>;
}

export function EliminatedHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<NoIcon />}>{children}</MetricHighlight>;
}

export function ReservedHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<SecurityIcon />}>{children}</MetricHighlight>;
}

export function OngoingEffectsHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<RefreshIcon />}>{children}</MetricHighlight>;
}

export function TargetHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<TargetIcon />}>{children}</MetricHighlight>;
}

export function CardHighlight({ children, color }: HighlightProps & { color: string }) {
  return (
    <MetricHighlight
      iconPlacement="before"
      icon={
        <CardIcon
          style={{ rotate: '15deg' }}
          color={color}
        />
      }
    >
      {children}
    </MetricHighlight>
  );
}
