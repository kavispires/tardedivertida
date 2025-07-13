import clsx from 'clsx';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
// Internal
import type { Good, WarehouseSlot } from '../utils/types';

type WarehouseProps = {
  goodsDict: Dictionary<Good>;
  warehouse: WarehouseSlot[];
  onPlaceGood?: (index: number) => void;
  width: number;
  goodClassName?: string;
  conceal?: boolean;
};

export function Warehouse({
  goodsDict,
  warehouse,
  width,
  onPlaceGood,
  goodClassName,
  conceal,
}: WarehouseProps) {
  const size = { width, height: width };

  return (
    <div className="warehouse">
      {warehouse.map((slot, index) => {
        if (slot.available) {
          return (
            <div
              key={index}
              className={clsx('warehouse__empty-shelf warehouse__empty-available-shelf')}
              style={size}
            >
              {onPlaceGood ? (
                <button
                  type="button"
                  className="warehouse__empty-shelf-button"
                  onClick={() => onPlaceGood?.(index)}
                >
                  {slot.temporaryName ?? '?'}
                </button>
              ) : (
                (slot.temporaryName ?? '?')
              )}
            </div>
          );
        }

        if (slot.amenityId) {
          return null;
        }

        if (slot.goodId) {
          const good = goodsDict[slot.goodId];

          if (good.exposed) {
            if (conceal) {
              return <MysteryBoxIcon width={width} />;
            }

            return (
              <div key={index} className={clsx('warehouse__shelf', 'warehouse__shelf-active')} style={size}>
                <WarehouseGoodCard
                  id={good.id}
                  width={width - 12}
                  className={clsx(getAnimationClass('bounce'), goodClassName)}
                />
              </div>
            );
          }

          return (
            <div key={index} className={clsx('warehouse__shelf', getAnimationClass('flipInY'))} style={size}>
              <ShippingBoxIcon width={width - 12} />
            </div>
          );
        }

        return (
          <div key={index} className={clsx('warehouse__empty-shelf')} style={size}>
            .
          </div>
        );
      })}
    </div>
  );
}
