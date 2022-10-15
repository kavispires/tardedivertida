import { ImageCardsIcon } from 'components/icons/ImageCardsIcon';
import { PlayerIcon } from 'components/icons/PlayerIcon';
import { PlayersIcon } from 'components/icons/PlayersIcon';
import { StarIcon } from 'components/icons/StarIcon';
import { MetricHighlight, MetricHighlightProps } from 'components/text/MetricHighlight';

type HighlightProps = Pick<MetricHighlightProps, 'children' | 'type'>;

export function PointsHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<StarIcon />} type={type}>
      {children}
    </MetricHighlight>
  );
}

export function CardHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<ImageCardsIcon />} type={type}>
      {children}
    </MetricHighlight>
  );
}

export function PlayerHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<PlayerIcon />} type={type}>
      {children}
    </MetricHighlight>
  );
}

export function PlayersHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<PlayersIcon />} type={type}>
      {children}
    </MetricHighlight>
  );
}
