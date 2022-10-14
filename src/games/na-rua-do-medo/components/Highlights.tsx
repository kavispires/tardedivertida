import clsx from 'clsx';
import { CandyIcon } from 'components/icons/CandyIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { TabletIcon } from 'components/icons/TabletIcon';
import { MetricHighlight, MetricHighlightProps } from 'components/text/MetricHighlight';

type HighlightProps = Pick<MetricHighlightProps, 'children' | 'type'>;

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
    <MetricHighlight icon={<IconAvatar size="large" icon={<CandyIcon />} />} type={type}>
      {children}
    </MetricHighlight>
  );
}

export function TitleIPadHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<IconAvatar size="small" icon={<TabletIcon />} />} type={type}>
      {children}
    </MetricHighlight>
  );
}
