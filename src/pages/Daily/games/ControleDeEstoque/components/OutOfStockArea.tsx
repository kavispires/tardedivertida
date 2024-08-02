import { DeleteFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';

type OutOfStockAreaProps = {
  onDeliver: ReturnType<typeof useControleDeEstoqueEngine>['onDeliver'];
  fulfillments: ReturnType<typeof useControleDeEstoqueEngine>['fulfillments'];
  width: number;
  disabled?: boolean;
};

export function OutOfStockArea({ onDeliver, fulfillments, width, disabled }: OutOfStockAreaProps) {
  const isFulfilled = fulfillments.find((f) => f.shelfIndex === -1);

  return (
    <div className="fulfillment-center__out-of-stock">
      {!!isFulfilled && (
        <WarehouseGoodCard
          id={isFulfilled.order}
          padding={1}
          width={width - 24}
          className="shelves-board__placed-order"
        />
      )}
      <Button size="large" onClick={() => onDeliver(-1)} disabled={!!isFulfilled || disabled} danger>
        <DeleteFilled />
      </Button>
    </div>
  );
}
