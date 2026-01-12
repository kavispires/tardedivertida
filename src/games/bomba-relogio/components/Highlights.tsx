// Icons
import { BombIcon } from 'icons/BombIcon';
import { BoxBlankIcon, SecurityIcon, TraitorIcon } from 'icons/collection';
import { WireIcon } from 'icons/WireIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
// Icons

export function TerroristHighlight({ children }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<TraitorIcon />}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}

export function AgentHighlight({ children }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<SecurityIcon />}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}

export function BombHighlight({ children }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<BombIcon />}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}

export function RedWireHighlight({ children }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<WireIcon />}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}

export function BlankHighlight({ children }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<BoxBlankIcon />}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}
