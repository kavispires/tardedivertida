// Icons
import { EventIcon } from 'icons/EventIcon';
import { CaptchaIcon } from 'icons/CaptchaIcon';
import { RobotIcon } from 'icons/RobotIcon';
import { EnergyIcon } from 'icons/EnergyIcon';
import { ThiefIcon } from 'icons/ThiefIcon';
// Components
import { HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';

export function EventHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<EventIcon />}>{children}</MetricHighlight>;
}

export function CaptchaHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<CaptchaIcon />}>{children}</MetricHighlight>;
}

export function RobotHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<RobotIcon />}>{children}</MetricHighlight>;
}

export function EnergyHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<EnergyIcon />}>{children}</MetricHighlight>;
}

export function SuspicionHighlight({ children }: HighlightProps) {
  return <MetricHighlight icon={<ThiefIcon />}>{children}</MetricHighlight>;
}
