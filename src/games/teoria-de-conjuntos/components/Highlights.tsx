// Icons
import { CircleIcon } from 'icons/CircleIcon';
import { XIcon } from 'icons/XIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function CircleHighlight({ children, type, color }: HighlightProps & { color: string }) {
  return (
    <MetricHighlight icon={<CircleIcon mainColor={color} />} type={type} iconPlacement="before">
      {children}
    </MetricHighlight>
  );
}

export function OutsideHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight icon={<XIcon mainColor="#736357" />} type={type} iconPlacement="before">
      {children}
    </MetricHighlight>
  );
}
