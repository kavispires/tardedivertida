import clsx from 'clsx';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';

import { getAnimationClass } from 'utils/helpers';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { TransparentButton } from 'components/buttons';

type FulfillmentBoardProps = {
  warehouse: ReturnType<typeof useControleDeEstoqueEngine>['warehouse'];
  onDeliver: ReturnType<typeof useControleDeEstoqueEngine>['onDeliver'];
  fulfillments: ReturnType<typeof useControleDeEstoqueEngine>['fulfillments'];
  width: number;
  reveal?: boolean;
};

export function FulfillmentBoard({
  warehouse,
  fulfillments,
  onDeliver,
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
              <WarehouseGoodCard
                id={isFulfilled.order}
                padding={1}
                width={width - 24}
                className="shelves-board__placed-order"
              />
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
              <TransparentButton onClick={() => onDeliver(index)}>
                <ShippingBoxIcon width={width - 12} className={getAnimationClass('bounce')} />
              </TransparentButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
