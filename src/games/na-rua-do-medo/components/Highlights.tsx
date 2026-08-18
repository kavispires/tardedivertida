import clsx from 'clsx';
// Icons
import { CandyIcon } from '@icons/CandyIcon';
import { CardIcon } from '@icons/CardIcon';
import { TabletIcon } from '@icons/TabletIcon';
// Components
import { Icon } from '@components/general/Icon';
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

export function CandyHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<CandyIcon />}
      type={type}
      className={clsx(type === 'positive' && 'n-candy-highlight')}
    >
      {children}
    </MetricHighlight>
  );
}

export function TitleCandyHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      icon={
        <Icon
          size="large"
          icon={<CandyIcon />}
        />
      }
      type={type}
    >
      {children}
    </MetricHighlight>
  );
}

export function TitleIPadHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      icon={
        <Icon
          size="large"
          icon={<TabletIcon />}
        />
      }
      type={type}
    >
      {children}
    </MetricHighlight>
  );
}

export function CardHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      iconPlacement="before"
      icon={
        <Icon
          size="large"
          icon={<CardIcon />}
        />
      }
      type={type}
    >
      {children}
    </MetricHighlight>
  );
}
