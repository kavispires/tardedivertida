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
};

export function StockingProgress({ status }: StockingProgressProps) {
  const { progress, goal, stocked, total } = status;
  return (
    <Translate
      en={
        <div className="c-stocking-progress">
          <span>
            Round goods:{' '}
            <MetricHighlight icon={<ClockIcon />}>
              {progress}/{goal}
            </MetricHighlight>
          </span>
          <span>
            Stocked Goods:{' '}
            <MetricHighlight icon={<ShippingBoxIcon />}>
              {stocked}/{total}
            </MetricHighlight>
          </span>
        </div>
      }
      pt={
        <div className="c-stocking-progress">
          <span>
            Mercadorias da rodada:{' '}
            <MetricHighlight icon={<ClockIcon />}>
              {progress}/{goal}
            </MetricHighlight>
          </span>
          <span>
            Mercadorias estocadas:{' '}
            <MetricHighlight icon={<ShippingBoxIcon />}>
              {stocked}/{total}
            </MetricHighlight>
          </span>
        </div>
      }
    />
  );
}
