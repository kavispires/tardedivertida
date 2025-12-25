// Icons
import { ClockIcon } from 'icons/ClockIcon';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { Translate } from 'components/language';
import { MetricHighlight } from 'components/metrics/MetricHighlight';

type StockingProgressProps = {
  /**
   * The number of goods that have been stocked this round
   * Usually `roundsGoodIndex`
   */
  stockingCount: number;
  /**
   * The total number of goods to be stocked this round
   * Usually `roundGoods.length`
   */
  stockingRoundCount: number;
  /**
   * The total number of goods that have been stocked so far
   */
  stocked: number;
};

export function StockingProgress({ stockingCount, stockingRoundCount, stocked }: StockingProgressProps) {
  return (
    <Translate
      en={
        <>
          Round goods:{' '}
          <MetricHighlight icon={<ClockIcon />}>
            {stockingCount}/{stockingRoundCount}
          </MetricHighlight>
          <br />
          Stocked Goods: <MetricHighlight icon={<ShippingBoxIcon />}>{stocked}/35</MetricHighlight>
        </>
      }
      pt={
        <>
          Mercadorias da rodada:{' '}
          <MetricHighlight icon={<ClockIcon />}>
            {stockingCount}/{stockingRoundCount}
          </MetricHighlight>
          <br />
          Mercadorias estocadas: <MetricHighlight icon={<ShippingBoxIcon />}>{stocked}/35</MetricHighlight>
        </>
      }
    />
  );
}
