import clsx from 'clsx';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
import { LocationIcon } from 'icons/LocationIcon';
import { OnlineOrderIcon } from 'icons/OnlineOrderIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
// Internal
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';

type OrdersProps = {
  fulfillments: ReturnType<typeof useControleDeEstoqueEngine>['fulfillments'];
  orders: ReturnType<typeof useControleDeEstoqueEngine>['orders'];
  activeOrder: ReturnType<typeof useControleDeEstoqueEngine>['activeOrder'];
  onSelectOrder: ReturnType<typeof useControleDeEstoqueEngine>['onSelectOrder'];
  shelfWidth: number;
};

export function Orders({ fulfillments, orders, onSelectOrder, shelfWidth, activeOrder }: OrdersProps) {
  return (
    <div className="fulfillment-center">
      <OnlineOrderIcon
        width={shelfWidth / 1.5}
        className={getAnimationClass('headShake', { infinite: true })}
      />
      <div className={clsx('fulfillment-center__orders', getAnimationClass('lightSpeedInLeft'))}>
        {orders.map((order) => {
          const isFulfilled = fulfillments.find((f) => f.order === order);

          return (
            <TransparentButton
              key={order}
              onClick={() => onSelectOrder(order)}
              disabled={fulfillments.length === 4 || !!isFulfilled}
            >
              {!!isFulfilled && <IconAvatar icon={<CheckMarkIcon />} />}
              {activeOrder === order && (
                <IconAvatar
                  icon={<LocationIcon />}
                  className={getAnimationClass('bounce', { infinite: true })}
                />
              )}
              <WarehouseGoodCard
                key={order}
                id={order}
                width={shelfWidth * 0.85}
                className={clsx(
                  'order',
                  activeOrder === order && 'order--active',
                  !!isFulfilled && 'order--fulfilled'
                )}
              />
            </TransparentButton>
          );
        })}
      </div>
    </div>
  );
}
