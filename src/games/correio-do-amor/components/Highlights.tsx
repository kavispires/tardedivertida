import type { ReactNode } from 'react';
// Icons
import { CardIcon } from '@icons/CardIcon';
import { DeckIcon } from '@icons/DeckIcon';
import { MysteryBoxIcon } from '@icons/MysteryBoxIcon';
import { NoIcon } from '@icons/NoIcon';
import { RefreshIcon } from '@icons/RefreshIcon.tsx';
import { TargetIcon } from '@icons/TargetIcon';
import { TrashIcon } from '@icons/TrashIcon';
import { VictoryCoinIcon } from '@icons/VictoryCoinIcon';
// Components
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';
// Internal
import type { FestaJuninaCard } from '../utils/types';

export function DeckHighlight({ children, ...props }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<DeckIcon />}
      {...props}
    >
      {children}
    </MetricHighlight>
  );
}

export function ScoreHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<VictoryCoinIcon />}>{children}</MetricHighlight>;
}

export function DiscardHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<TrashIcon />}>{children}</MetricHighlight>;
}

export function EliminatedHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<NoIcon />}
      type={type}
    >
      {children}
    </MetricHighlight>
  );
}

export function ReservedHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<MysteryBoxIcon />}>{children}</MetricHighlight>;
}

export function OngoingEffectsHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<RefreshIcon />}>{children}</MetricHighlight>;
}

export function TargetHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<TargetIcon />}>{children}</MetricHighlight>;
}

type PlayedCardHighlightProps = Omit<HighlightProps, 'children'> & {
  card: FestaJuninaCard;
  showRank?: boolean;
  children?: ReactNode;
};

export function PlayedCardHighlight({ card, showRank, children, ...props }: PlayedCardHighlightProps) {
  return (
    <MetricHighlight
      iconPlacement="before"
      icon={
        <CardIcon
          style={{ rotate: '15deg' }}
          color={card.color}
        />
      }
      {...props}
    >
      {children ? children : `${showRank ? `#${card.rank} ` : ''}${card.name}`}
    </MetricHighlight>
  );
}
