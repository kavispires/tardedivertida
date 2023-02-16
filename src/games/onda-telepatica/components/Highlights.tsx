import { WavelengthDeviceIcon } from 'components/icons/WavelengthDeviceIcon';
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function WavelengthHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<WavelengthDeviceIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}
