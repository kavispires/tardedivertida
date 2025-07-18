// Ant Design Resources
import { BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
// Types
import type { SpectrumCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { WavelengthDeviceIcon } from 'icons/WavelengthDeviceIcon';
// Components
import { type HighlightProps, MetricHighlight } from 'components/metrics/MetricHighlight';
import { TextHighlight } from 'components/text';

export function WavelengthHighlight({ children, type, iconSize, className }: HighlightProps) {
  return (
    <MetricHighlight icon={<WavelengthDeviceIcon />} type={type} iconSize={iconSize} className={className}>
      {children}
    </MetricHighlight>
  );
}

type TargetSideHighlightProps = {
  target: number;
  card?: SpectrumCard;
};

export function TargetSideHighlight({ target, card }: TargetSideHighlightProps) {
  const { language } = useLanguage();
  if (!card) {
    return null;
  }
  if (target === 0) {
    return language === 'pt' ? (
      <>
        exatamente <TextHighlight>entre</TextHighlight> os dois
      </>
    ) : (
      <>
        exactly <TextHighlight>in the middle</TextHighlight> of both ideas
      </>
    );
  }

  const side = target < 0 ? card.left : card.right;
  const leftIcon = target < 0 && <BackwardOutlined />;
  const rightIcon = target > 0 && <ForwardOutlined />;

  return language === 'pt' ? (
    <>
      do lado{' '}
      <TextHighlight>
        {leftIcon} {side} {rightIcon}
      </TextHighlight>
    </>
  ) : (
    <>
      on the{' '}
      <TextHighlight>
        {leftIcon} {side} {rightIcon}
      </TextHighlight>{' '}
      side
    </>
  );
}
