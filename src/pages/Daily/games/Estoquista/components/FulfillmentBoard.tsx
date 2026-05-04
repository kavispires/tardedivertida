import clsx from 'clsx';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
// Internal
import type { useEstoquistaEngine } from '../utils/useEstoquistaEngine';

type FulfillmentBoardProps = {
  activeOrder: ReturnType<typeof useEstoquistaEngine>['activeOrder'];
  warehouse: ReturnType<typeof useEstoquistaEngine>['warehouse'];
  onFulfill: ReturnType<typeof useEstoquistaEngine>['onFulfill'];
  onTakeBack: ReturnType<typeof useEstoquistaEngine>['onTakeBack'];
  fulfillments: ReturnType<typeof useEstoquistaEngine>['fulfillments'];
  width: number;
  reveal?: boolean;
};

export function FulfillmentBoard({
  activeOrder,
  warehouse,
  fulfillments,
  onFulfill,
  onTakeBack,
  width,
  reveal = false,
}: FulfillmentBoardProps) {
  const size = { width, height: width };

  return (
    <div className="shelves-board">
      {warehouse.map((goodId, index) => {
        if (!goodId) {
          return <div key={index}>X</div>;
        }

        const isFulfilled = fulfillments.find((f) => f.shelfIndex === index);

        if (isFulfilled) {
          return (
            <div
              key={index}
              className={clsx('shelves-board__shelf', 'shelves-board__shelf-fulfilled')}
              style={size}
            >
              {reveal ? (
                <WarehouseGoodCard
                  goodId={isFulfilled.order}
                  width={width - 24}
                  className="shelves-board__placed-order"
                />
              ) : (
                <TransparentButton
                  onClick={() => onTakeBack(isFulfilled.order)}
                  hoverType="none"
                >
                  <WarehouseGoodCard
                    goodId={isFulfilled.order}
                    width={width - 24}
                    className="shelves-board__placed-order"
                  />
                </TransparentButton>
              )}
              {reveal ? (
                <WarehouseGoodCard
                  goodId={goodId}
                  width={width - 12}
                />
              ) : (
                <ShippingBoxIcon width={width - 12} />
              )}
            </div>
          );
        }

        return (
          <div
            key={index}
            className={clsx('shelves-board__shelf')}
            style={size}
          >
            {reveal ? (
              <WarehouseGoodCard
                goodId={goodId}
                width={width - 12}
              />
            ) : (
              <TransparentButton onClick={activeOrder ? () => onFulfill(index) : undefined}>
                <ShippingBoxIcon
                  width={width - 12}
                  className={getAnimationClass('bounce')}
                />
              </TransparentButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
