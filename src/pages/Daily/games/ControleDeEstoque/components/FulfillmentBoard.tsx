import clsx from 'clsx';
import { TransparentButton } from 'components/buttons';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
import { getAnimationClass } from 'utils/helpers';

import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';

type FulfillmentBoardProps = {
  activeOrder: ReturnType<typeof useControleDeEstoqueEngine>['activeOrder'];
  warehouse: ReturnType<typeof useControleDeEstoqueEngine>['warehouse'];
  onFulfill: ReturnType<typeof useControleDeEstoqueEngine>['onFulfill'];
  onTakeBack: ReturnType<typeof useControleDeEstoqueEngine>['onTakeBack'];
  fulfillments: ReturnType<typeof useControleDeEstoqueEngine>['fulfillments'];
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
                  id={isFulfilled.order}
                  padding={1}
                  width={width - 24}
                  className="shelves-board__placed-order"
                />
              ) : (
                <TransparentButton onClick={() => onTakeBack(isFulfilled.order)} hoverType="none">
                  <WarehouseGoodCard
                    id={isFulfilled.order}
                    padding={1}
                    width={width - 24}
                    className="shelves-board__placed-order"
                  />
                </TransparentButton>
              )}
              {reveal ? (
                <WarehouseGoodCard id={goodId} padding={1} width={width - 12} />
              ) : (
                <ShippingBoxIcon width={width - 12} />
              )}
            </div>
          );
        }

        return (
          <div key={index} className={clsx('shelves-board__shelf')} style={size}>
            {reveal ? (
              <WarehouseGoodCard id={goodId} padding={1} width={width - 12} />
            ) : (
              <TransparentButton onClick={activeOrder ? () => onFulfill(index) : undefined}>
                <ShippingBoxIcon width={width - 12} className={getAnimationClass('bounce')} />
              </TransparentButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
