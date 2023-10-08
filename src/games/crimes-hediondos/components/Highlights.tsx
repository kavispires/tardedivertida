// Icons
import { BoxIcon } from 'icons/BoxIcon';
import { KnifeIcon } from 'icons/KnifeIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function WeaponHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<KnifeIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}

export function EvidenceHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<BoxIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
