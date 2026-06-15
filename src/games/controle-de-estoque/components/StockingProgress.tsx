// Icons
import { ClockIcon } from 'icons/ClockIcon';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { Translate } from 'components/language/Translate';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
// Internal
import type { Status } from '../utils/types';

type StockingProgressProps = {
  status: Status;
  hideTitles?: boolean;
};

export function StockingProgress({ status }: StockingProgressProps) {
  const { progress, goal, stocked, total } = status;

  return (
    <div className="c-stocking-progress">
      <span>
        <Translate
          en="Round goods"
          pt="Mercadorias da rodada"
        />
        :{' '}
        <MetricHighlight icon={<ClockIcon />}>
          {progress}/{goal}
        </MetricHighlight>
      </span>
      <span>
        <Translate
          en="Stocked Goods"
          pt="Mercadorias estocadas"
        />
        :{' '}
        <MetricHighlight icon={<ShippingBoxIcon />}>
          {stocked}/{total}
        </MetricHighlight>
      </span>
    </div>
  );
}

export function RoundStockingProgress({ status, hideTitles }: StockingProgressProps) {
  const { progress, goal } = status;

  return (
    <span>
      {!hideTitles && (
        <Translate
          en="Round goods: "
          pt="Mercadorias da rodada: "
        />
      )}

      <MetricHighlight icon={<ClockIcon />}>
        {progress}/{goal}
      </MetricHighlight>
    </span>
  );
}
