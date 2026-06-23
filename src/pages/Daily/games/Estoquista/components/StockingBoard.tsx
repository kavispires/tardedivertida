import clsx from 'clsx';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { ShippingBoxIcon } from '@icons/ShippingBoxIcon';
// Components
import { WarehouseGoodCard } from '@components/cards/WarehouseGoodCard';
// Internal
import type { useEstoquistaEngine } from '../utils/useEstoquistaEngine';

type StockingBoardProps = {
  warehouse: ReturnType<typeof useEstoquistaEngine>['warehouse'];
  onPlaceGood: ReturnType<typeof useEstoquistaEngine>['onPlaceGood'];
  lastPlacedGoodId: ReturnType<typeof useEstoquistaEngine>['lastPlacedGoodId'];
  width: number;
};

export function StockingBoard({ warehouse, onPlaceGood, width, lastPlacedGoodId }: StockingBoardProps) {
  const size = { width, height: width };

  return (
    <div className="shelves-board">
      {warehouse.map((goodId, index) => {
        if (!goodId) {
          return (
            <div
              key={index}
              className={clsx('shelves-board__empty-shelf')}
              style={size}
            >
              <button
                type="button"
                className="shelves-board__empty-shelf-button"
                onClick={() => onPlaceGood(index)}
              >
                ?
              </button>
            </div>
          );
        }

        if (goodId !== lastPlacedGoodId) {
          return (
            <div
              key={index}
              className={clsx('shelves-board__shelf', getAnimationClass('flipInY'))}
              style={size}
            >
              <ShippingBoxIcon width={width - 12} />
            </div>
          );
        }

        return (
          <div
            key={index}
            className={clsx('shelves-board__shelf')}
            style={size}
          >
            <WarehouseGoodCard
              goodId={goodId}
              width={width - 12}
              className={getAnimationClass('bounce')}
            />
          </div>
        );
      })}
    </div>
  );
}
