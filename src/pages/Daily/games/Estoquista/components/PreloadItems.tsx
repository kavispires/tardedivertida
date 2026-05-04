// Components
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';

type PreloadItemsProps = {
  goods: string[];
};

export function PreloadItems({ goods }: PreloadItemsProps) {
  return (
    <div style={{ display: 'none' }}>
      {goods.map((itemId) => (
        <WarehouseGoodCard
          key={itemId}
          goodId={itemId}
          className="transparent"
          width={1}
        />
      ))}
    </div>
  );
}
