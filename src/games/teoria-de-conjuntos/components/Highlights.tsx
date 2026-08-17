// Ant Design Resources
import { Tooltip } from 'antd';
// Icons
import { CircleIcon } from '@icons/CircleIcon';
import { HandOfCardsIcon } from '@icons/HandOfCardsIcon';
import { XIcon } from '@icons/XIcon';
// Components
import { Translate } from '@components/language/Translate';
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

export function CircleHighlight({ children, type, color }: HighlightProps & { color: string }) {
  return (
    <MetricHighlight
      icon={<CircleIcon mainColor={color} />}
      type={type}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}

export function OutsideHighlight({ children, type }: HighlightProps) {
  return (
    <MetricHighlight
      icon={<XIcon mainColor="#736357" />}
      type={type}
      iconPlacement="before"
    >
      {children}
    </MetricHighlight>
  );
}

export function ThingsCountHighlight(props: HighlightProps) {
  return (
    <Tooltip
      title={
        <Translate
          en="Items to place and total items"
          pt="Itens para posicionar e total de itens"
        />
      }
    >
      <div style={{ display: 'inline-block' }}>
        <MetricHighlight
          icon={<HandOfCardsIcon />}
          iconPlacement="before"
          {...props}
        />
      </div>
    </Tooltip>
  );
}
