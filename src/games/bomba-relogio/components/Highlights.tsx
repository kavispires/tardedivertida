// Icons
import { BombIcon } from 'icons/BombIcon';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { SecurityIcon } from 'icons/SecurityIcon';
import { TraitorIcon } from 'icons/TraitorIcon';
import { WireIcon } from 'icons/WireIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

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

export function BombHighlight({ children, ...rest }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<BombIcon />}
      iconPlacement="before"
      {...rest}
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
